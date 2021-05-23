from sqlalchemy import Column, Integer, String

from common.models import AppModel, TimestampedModel


class Player(AppModel, TimestampedModel):
    name = Column(String(100), nullable=False)
    nickname = Column(String(50), nullable=False, unique=True, index=True)
    level = Column(Integer, default=1, nullable=False)
    points = Column(Integer, default=0, nullable=False)
