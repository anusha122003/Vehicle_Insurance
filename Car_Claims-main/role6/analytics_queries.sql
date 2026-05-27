-- =============================================================
-- ROLE 6: SQL Analytics Queries
-- Run these in Snowflake, PostgreSQL, or any SQL engine.
-- Assumes a table named: car_claims
-- =============================================================

-- ── 1. Overall KPI Summary ───────────────────────────────────────────────────
SELECT
    COUNT(*)                                          AS total_claims,
    SUM(CASE WHEN FraudFound = 'Yes' THEN 1 ELSE 0 END)
                                                      AS fraud_count,
    ROUND(
        SUM(CASE WHEN FraudFound = 'Yes' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2
    )                                                 AS fraud_rate_pct,
    ROUND(AVG(Deductible), 2)                         AS avg_deductible,
    COUNT(DISTINCT PolicyNumber)                      AS unique_policies
FROM car_claims;


-- ── 2. Monthly Claims & Fraud Trend ─────────────────────────────────────────
SELECT
    Month,
    COUNT(*)                                                AS total_claims,
    SUM(CASE WHEN FraudFound = 'Yes' THEN 1 ELSE 0 END)    AS fraud_claims,
    ROUND(
        SUM(CASE WHEN FraudFound = 'Yes' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2
    )                                                       AS fraud_rate_pct
FROM car_claims
GROUP BY Month
ORDER BY
    CASE Month
        WHEN 'Jan' THEN 1  WHEN 'Feb' THEN 2  WHEN 'Mar' THEN 3
        WHEN 'Apr' THEN 4  WHEN 'May' THEN 5  WHEN 'Jun' THEN 6
        WHEN 'Jul' THEN 7  WHEN 'Aug' THEN 8  WHEN 'Sep' THEN 9
        WHEN 'Oct' THEN 10 WHEN 'Nov' THEN 11 WHEN 'Dec' THEN 12
    END;


-- ── 3. Claims & Fraud by Vehicle Make ────────────────────────────────────────
SELECT
    Make,
    COUNT(*)                                                AS total_claims,
    SUM(CASE WHEN FraudFound = 'Yes' THEN 1 ELSE 0 END)    AS fraud_count,
    ROUND(
        SUM(CASE WHEN FraudFound = 'Yes' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2
    )                                                       AS fraud_rate_pct
FROM car_claims
GROUP BY Make
ORDER BY fraud_rate_pct DESC;


-- ── 4. Payout Calculation Per Claim (joined with CV damage %) ────────────────
-- NOTE: damage_pct comes from the CV model (Role 2), stored in a
--       separate table: cv_results(PolicyNumber, damage_pct, part_label)
SELECT
    c.PolicyNumber,
    c.Make,
    c.VehiclePrice,
    cv.damage_pct,
    cv.part_label,
    c.Deductible,
    c.BasePolicy,
    c.FraudFound,
    GREATEST(
        ROUND(cv.damage_pct / 100.0 *
            CASE c.VehiclePrice
                WHEN 'less than 20,000'  THEN 15000
                WHEN '20,000 to 29,000'  THEN 24500
                WHEN '30,000 to 39,000'  THEN 34500
                WHEN '40,000 to 59,000'  THEN 49500
                WHEN '60,000 to 69,000'  THEN 64500
                WHEN 'more than 69,000'  THEN 80000
                ELSE 25000
            END - c.Deductible, 2),
        0
    )                                                       AS estimated_payout
FROM car_claims c
LEFT JOIN cv_results cv ON c.PolicyNumber = cv.PolicyNumber;


-- ── 5. Average Deductible & Payout by Base Policy ────────────────────────────
SELECT
    BasePolicy,
    COUNT(*)                                                AS total_claims,
    ROUND(AVG(Deductible), 2)                               AS avg_deductible,
    SUM(CASE WHEN FraudFound = 'Yes' THEN 1 ELSE 0 END)    AS fraud_count
FROM car_claims
GROUP BY BasePolicy
ORDER BY total_claims DESC;


-- ── 6. High-Risk Claims (Fraud Indicators) ───────────────────────────────────
SELECT
    PolicyNumber, Make, AccidentArea, Fault,
    PoliceReportFiled, WitnessPresent,
    AddressChange_Claim AS AddressChanged,
    NumberOfSuppliments,
    FraudFound
FROM car_claims
WHERE
    PoliceReportFiled = 'No'
    AND WitnessPresent = 'No'
    AND FraudFound = 'Yes'
ORDER BY PolicyNumber;


-- ── 7. Urban vs Rural Fraud Rate ─────────────────────────────────────────────
SELECT
    AccidentArea,
    COUNT(*)                                                AS claims,
    SUM(CASE WHEN FraudFound = 'Yes' THEN 1 ELSE 0 END)    AS fraud,
    ROUND(
        SUM(CASE WHEN FraudFound = 'Yes' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2
    )                                                       AS fraud_rate_pct
FROM car_claims
GROUP BY AccidentArea;


-- ── 8. Age Group Risk Analysis ───────────────────────────────────────────────
SELECT
    AgeOfPolicyHolder,
    COUNT(*)                                                AS claims,
    SUM(CASE WHEN FraudFound = 'Yes' THEN 1 ELSE 0 END)    AS fraud_count,
    ROUND(
        SUM(CASE WHEN FraudFound = 'Yes' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2
    )                                                       AS fraud_rate_pct
FROM car_claims
GROUP BY AgeOfPolicyHolder
ORDER BY fraud_rate_pct DESC;


-- ── 9. Snowflake: Create + Populate Table ────────────────────────────────────
-- Run this once to load the CSV into Snowflake
/*
CREATE OR REPLACE TABLE car_claims (
    Month             VARCHAR,
    WeekOfMonth       INT,
    DayOfWeek         VARCHAR,
    Make              VARCHAR,
    AccidentArea      VARCHAR,
    DayOfWeekClaimed  VARCHAR,
    MonthClaimed      VARCHAR,
    WeekOfMonthClaimed INT,
    Sex               VARCHAR,
    MaritalStatus     VARCHAR,
    Age               INT,
    Fault             VARCHAR,
    PolicyType        VARCHAR,
    VehicleCategory   VARCHAR,
    VehiclePrice      VARCHAR,
    PolicyNumber      INT,
    RepNumber         INT,
    Deductible        INT,
    DriverRating      INT,
    DaysPolicyAccident VARCHAR,
    DaysPolicyClaim    VARCHAR,
    PastNumberOfClaims VARCHAR,
    AgeOfVehicle       VARCHAR,
    AgeOfPolicyHolder  VARCHAR,
    PoliceReportFiled  VARCHAR,
    WitnessPresent     VARCHAR,
    AgentType          VARCHAR,
    NumberOfSuppliments VARCHAR,
    AddressChange_Claim VARCHAR,
    NumberOfCars        VARCHAR,
    Year                INT,
    BasePolicy          VARCHAR,
    FraudFound          VARCHAR
);

-- Load from S3 / internal stage:
COPY INTO car_claims
FROM @my_stage/carclaims.csv
FILE_FORMAT = (TYPE = CSV FIELD_OPTIONALLY_ENCLOSED_BY='"' SKIP_HEADER=1);
*/
