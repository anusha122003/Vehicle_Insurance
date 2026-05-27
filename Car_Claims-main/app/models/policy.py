from sqlalchemy import Column, Integer, String
from app.database.session import Base

class Policy(Base):
    __tablename__ = "policies"

    policy_number = Column(Integer, primary_key=True, index=True)
    policy_type = Column(String, nullable=True)
    vehicle_category = Column(String, nullable=True)
    vehicle_price = Column(String, nullable=True)
    deductible = Column(Integer, default=400)
    base_policy = Column(String, nullable=True)
