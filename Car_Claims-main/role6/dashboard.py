import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from pathlib import Path

# ── Page config ───────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="Car Claims Analytics — Admin Dashboard",
    page_icon="🚗",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Custom CSS ─────────────────────────────────────────────────────────────────
st.markdown("""
<style>
    .metric-card {
        background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%);
        border-radius: 12px;
        padding: 20px;
        color: white;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .metric-title { font-size: 14px; opacity: 0.85; margin-bottom: 6px; }
    .metric-value { font-size: 32px; font-weight: 700; }
    .metric-sub   { font-size: 13px; opacity: 0.7; margin-top: 4px; }
    .fraud-card   { background: linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%); }
    .payout-card  { background: linear-gradient(135deg, #14532d 0%, #16a34a 100%); }
    .pending-card { background: linear-gradient(135deg, #78350f 0%, #d97706 100%); }
    .stPlotlyChart { border-radius: 10px; }
    h1 { color: #1e3a5f !important; }
    .section-header {
        font-size: 18px; font-weight: 600; color: #1e3a5f;
        border-bottom: 2px solid #2563eb; padding-bottom: 6px; margin: 20px 0 10px 0;
    }
</style>
""", unsafe_allow_html=True)

# ── Data loading ───────────────────────────────────────────────────────────────
@st.cache_data
def load_data(csv_path: str) -> pd.DataFrame:
    df = pd.read_csv(csv_path)

    # Encode fraud as binary
    df["FraudBinary"] = (df["FraudFound"] == "Yes").astype(int)

    # Check if the mapper script was run
    if "CV_Damage_Pct" not in df.columns:
        st.error("⚠️ Please run dataset_mapper.py first to generate processed_claims.csv!")
        st.stop()
    else:
        df["DamagePct"] = df["CV_Damage_Pct"]

    # Month ordering
    month_order = ["Jan","Feb","Mar","Apr","May","Jun",
                   "Jul","Aug","Sep","Oct","Nov","Dec"]
    df["Month"] = pd.Categorical(df["Month"], categories=month_order, ordered=True)

    return df

# ── Sidebar filters ────────────────────────────────────────────────────────────
def render_sidebar(df: pd.DataFrame):
    st.sidebar.image("https://img.icons8.com/fluency/96/car-crash.png", width=60)
    st.sidebar.title("🔍 Filters")

    year = st.sidebar.multiselect(
        "Year", sorted(df["Year"].unique()), default=sorted(df["Year"].unique())
    )
    make = st.sidebar.multiselect(
        "Vehicle Make", sorted(df["Make"].unique()), default=sorted(df["Make"].unique())
    )
    base_policy = st.sidebar.multiselect(
        "Base Policy", df["BasePolicy"].unique().tolist(),
        default=df["BasePolicy"].unique().tolist()
    )
    fraud_filter = st.sidebar.radio(
        "Fraud Status", ["All", "Fraudulent Only", "Legitimate Only"]
    )

    mask = (
        df["Year"].isin(year) &
        df["Make"].isin(make) &
        df["BasePolicy"].isin(base_policy)
    )
    if fraud_filter == "Fraudulent Only":
        mask &= df["FraudBinary"] == 1
    elif fraud_filter == "Legitimate Only":
        mask &= df["FraudBinary"] == 0

    return df[mask]

# ── KPI Cards ──────────────────────────────────────────────────────────────────
def render_kpis(df: pd.DataFrame):
    total = len(df)
    fraud_count = df["FraudBinary"].sum()
    fraud_rate = fraud_count / total * 100 if total else 0
    total_payout = df["EstimatedPayout"].sum()
    avg_payout = df["EstimatedPayout"].mean()
    avg_damage = df["DamagePct"].mean()

    c1, c2, c3, c4, c5 = st.columns(5)
    cards = [
        (c1, "📋 Total Claims", f"{total:,}", f"Across {df['Year'].nunique()} year(s)", ""),
        (c2, "🚨 Fraudulent Claims", f"{fraud_count:,}", f"{fraud_rate:.1f}% fraud rate", "fraud-card"),
        (c3, "💰 Total Payout", f"${total_payout/1e6:.2f}M", f"Avg ${avg_payout:,.0f} per claim", "payout-card"),
        (c4, "🔧 Avg Damage %", f"{avg_damage:.1f}%", "Estimated by CV model", ""),
        (c5, "📁 Unique Policies", f"{df['PolicyNumber'].nunique():,}", "Active records", "pending-card"),
    ]
    for col, title, value, sub, extra_cls in cards:
        with col:
            st.markdown(f"""
            <div class="metric-card {extra_cls}">
                <div class="metric-title">{title}</div>
                <div class="metric-value">{value}</div>
                <div class="metric-sub">{sub}</div>
            </div>""", unsafe_allow_html=True)
    st.markdown("<br>", unsafe_allow_html=True)

# ── Chart: Monthly Claims + Fraud Trend ───────────────────────────────────────
def chart_monthly_trend(df: pd.DataFrame):
    monthly = df.groupby("Month", observed=True).agg(
        Total=("FraudBinary", "count"),
        Fraud=("FraudBinary", "sum"),
    ).reset_index()
    monthly["FraudRate"] = (monthly["Fraud"] / monthly["Total"] * 100).round(1)

    fig = make_subplots(specs=[[{"secondary_y": True}]])
    fig.add_trace(go.Bar(x=monthly["Month"], y=monthly["Total"],
                         name="Total Claims", marker_color="#93c5fd"), secondary_y=False)
    fig.add_trace(go.Bar(x=monthly["Month"], y=monthly["Fraud"],
                         name="Fraudulent", marker_color="#dc2626"), secondary_y=False)
    fig.add_trace(go.Scatter(x=monthly["Month"], y=monthly["FraudRate"],
                              name="Fraud Rate %", mode="lines+markers",
                              line=dict(color="#f59e0b", width=2.5),
                              marker=dict(size=7)), secondary_y=True)

    fig.update_layout(
        title="Monthly Claims Volume & Fraud Rate",
        barmode="overlay",
        legend=dict(orientation="h", y=1.12),
        plot_bgcolor="white", paper_bgcolor="white",
        height=380,
    )
    fig.update_yaxes(title_text="Claim Count", secondary_y=False, gridcolor="#f0f0f0")
    fig.update_yaxes(title_text="Fraud Rate (%)", secondary_y=True, showgrid=False)
    st.plotly_chart(fig, use_container_width=True)

# ── Chart: Claims by Vehicle Make ─────────────────────────────────────────────
def chart_by_make(df: pd.DataFrame):
    by_make = df.groupby("Make").agg(
        Claims=("FraudBinary", "count"),
        FraudCount=("FraudBinary", "sum"),
        AvgPayout=("EstimatedPayout", "mean"),
    ).reset_index().sort_values("Claims", ascending=True).tail(12)
    by_make["FraudRate"] = (by_make["FraudCount"] / by_make["Claims"] * 100).round(1)

    fig = px.bar(by_make, x="Claims", y="Make", orientation="h",
                 color="FraudRate", color_continuous_scale="RdYlGn_r",
                 text="Claims",
                 labels={"FraudRate": "Fraud Rate %"},
                 title="Claims by Vehicle Make (colour = fraud rate)")
    fig.update_traces(textposition="outside")
    fig.update_layout(height=420, plot_bgcolor="white", paper_bgcolor="white",
                      yaxis=dict(gridcolor="#f0f0f0"))
    st.plotly_chart(fig, use_container_width=True)

# ── Chart: Payout Distribution ────────────────────────────────────────────────
def chart_payout_dist(df: pd.DataFrame):
    fig = px.histogram(df, x="EstimatedPayout", color="FraudFound",
                       nbins=50, barmode="overlay",
                       color_discrete_map={"Yes": "#dc2626", "No": "#2563eb"},
                       title="Estimated Payout Distribution — Fraud vs Legitimate",
                       labels={"EstimatedPayout": "Payout ($)", "FraudFound": "Fraud"})
    fig.update_layout(height=360, plot_bgcolor="white", paper_bgcolor="white")
    st.plotly_chart(fig, use_container_width=True)

# ── Chart: Accident Area Breakdown ────────────────────────────────────────────
def chart_accident_area(df: pd.DataFrame):
    by_area = df.groupby(["AccidentArea", "FraudFound"]).size().reset_index(name="Count")
    fig = px.bar(by_area, x="AccidentArea", y="Count", color="FraudFound",
                 barmode="group", color_discrete_map={"Yes": "#dc2626", "No": "#16a34a"},
                 title="Claims by Accident Area",
                 labels={"FraudFound": "Fraud"})
    fig.update_layout(height=340, plot_bgcolor="white", paper_bgcolor="white",
                      xaxis=dict(gridcolor="#f0f0f0"))
    st.plotly_chart(fig, use_container_width=True)

# ── Chart: Damage % Boxplot by Policy Type ───────────────────────────────────
def chart_damage_by_policy(df: pd.DataFrame):
    fig = px.box(df, x="BasePolicy", y="DamagePct", color="FraudFound",
                 color_discrete_map={"Yes": "#dc2626", "No": "#2563eb"},
                 title="Damage % Distribution by Policy Type",
                 labels={"DamagePct": "Damage %", "FraudFound": "Fraud"})
    fig.update_layout(height=360, plot_bgcolor="white", paper_bgcolor="white")
    st.plotly_chart(fig, use_container_width=True)

# ── Chart: Top Fraud Risk Indicators ─────────────────────────────────────────
def chart_fraud_indicators(df: pd.DataFrame):
    binary_cols = [
        "PoliceReportFiled", "WitnessPresent", "AgentType",
        "AddressChange_Claim", "NumberOfSuppliments"
    ]
    rows = []
    for col in binary_cols:
        # Check if column exists to prevent errors
        if col in df.columns:
            for val in df[col].unique():
                sub = df[df[col] == val]
                rate = sub["FraudBinary"].mean() * 100
                rows.append({"Feature": f"{col} = {val}", "Fraud Rate %": round(rate, 1), "Count": len(sub)})
                
    indicator_df = pd.DataFrame(rows).sort_values("Fraud Rate %", ascending=True)

    fig = px.bar(indicator_df, x="Fraud Rate %", y="Feature", orientation="h",
                 text="Fraud Rate %", color="Fraud Rate %",
                 color_continuous_scale="RdYlGn_r",
                 title="Fraud Rate by Key Feature Values",
                 hover_data=["Count"])
    fig.update_traces(texttemplate="%{text:.1f}%", textposition="outside")
    fig.update_layout(height=500, plot_bgcolor="white", paper_bgcolor="white",
                      showlegend=False)
    st.plotly_chart(fig, use_container_width=True)

# ── Raw data table ─────────────────────────────────────────────────────────────
def render_table(df: pd.DataFrame):
    st.markdown('<div class="section-header">📄 Raw Claims Data</div>', unsafe_allow_html=True)
    cols = ["PolicyNumber", "Make", "CV_Damage_Type", "VehiclePrice",
            "DamagePct", "EstimatedPayout", "Deductible", "BasePolicy",
            "AccidentArea", "FraudFound", "Month", "Year"]
    
    # Only keep columns that actually exist in the dataframe
    display_cols = [c for c in cols if c in df.columns]
    display_df = df[display_cols].copy()
    
    # Rename columns for display if they exist
    rename_map = {"DamagePct": "Damage %", "EstimatedPayout": "Payout ($)", "FraudFound": "Fraud"}
    display_df.rename(columns={k: v for k, v in rename_map.items() if k in display_df.columns}, inplace=True)

    # Colour rows
    def highlight_fraud(row):
        colour = "background-color: #fee2e2" if "Fraud" in row and row["Fraud"] == "Yes" else ""
        return [colour] * len(row)

    # Format dictionary dynamically based on available columns
    format_dict = {}
    if "Payout ($)" in display_df.columns: format_dict["Payout ($)"] = "${:,.0f}"
    if "Damage %" in display_df.columns: format_dict["Damage %"] = "{:.1f}%"

    st.dataframe(
        display_df.style.apply(highlight_fraud, axis=1).format(format_dict),
        use_container_width=True,
        height=350,
    )

# ── Main app ──────────────────────────────────────────────────────────────────
def main():
    st.title("🚗 Car Insurance Claims — Analytics Dashboard")
    st.caption("Internal admin view · Insurance Operations Team")

    # POINTING TO THE NEW PROCESSED CSV HERE!
    candidates = [
        "processed_claims.csv",
        "../processed_claims.csv"
    ]
    
    csv_path = None
    for c in candidates:
        if Path(c).exists():
            csv_path = c
            break

    if csv_path is None:
        st.error("processed_claims.csv not found. Please run dataset_mapper.py first.")
        return

    df_raw = load_data(csv_path)
    df = render_sidebar(df_raw)

    st.info(f"Showing **{len(df):,}** of **{len(df_raw):,}** total records based on sidebar filters.")

    # KPIs
    render_kpis(df)

    # Row 1: Monthly trend + payout dist
    st.markdown('<div class="section-header">📈 Trends & Distributions</div>', unsafe_allow_html=True)
    col1, col2 = st.columns([3, 2])
    with col1: chart_monthly_trend(df)
    with col2: chart_payout_dist(df)

    # Row 2: Make breakdown + accident area
    st.markdown('<div class="section-header">🚗 Vehicle & Location Analysis</div>', unsafe_allow_html=True)
    col3, col4 = st.columns(2)
    with col3: chart_by_make(df)
    with col4: chart_accident_area(df)

    # Row 3: Damage + fraud indicators
    st.markdown('<div class="section-header">🔍 Fraud Intelligence</div>', unsafe_allow_html=True)
    col5, col6 = st.columns(2)
    with col5: chart_damage_by_policy(df)
    with col6: chart_fraud_indicators(df)

    # Raw table
    render_table(df)

    st.markdown("---")
    st.caption("Dashboard built with Streamlit + Plotly · Data: Real tabular records merged with AI logic")

if __name__ == "__main__":
    main()