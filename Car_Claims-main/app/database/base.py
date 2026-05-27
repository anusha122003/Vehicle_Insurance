# Import all models here so Alembic can discover them
from app.database.session import Base
from app.models.user import User
from app.models.claim import Claim
from app.models.policy import Policy
