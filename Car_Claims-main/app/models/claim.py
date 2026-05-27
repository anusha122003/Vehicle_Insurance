from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean
from app.database.session import Base

class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    policy_number = Column(Integer, ForeignKey("policies.policy_number"), nullable=False)
    make = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    accident_area = Column(String, nullable=True)
    witness_present = Column(String, default="No")
    police_report_filed = Column(String, default="No")
    
    # Computer Vision assessment attributes
    cv_damage_type = Column(String, default="unknown")
    cv_damage_pct = Column(Float, default=0.0)
    estimated_payout = Column(Float, default=0.0)
    deductible = Column(Float, default=0.0)

    # Claim outcome status
    status = Column(String, default="Pending") # e.g. Pending, Approved, Denied, Review
    fraud_found = Column(String, default="No") # Yes / No
