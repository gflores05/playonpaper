import datetime
from sqlalchemy import Column, Integer, DateTime
from sqlalchemy.ext.declarative import as_declarative, declared_attr


@as_declarative()
class AppModel:
    id = Column(Integer, primary_key=True, index=True)
    __name__: str

    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()


@as_declarative()
class TimestampedModel:
    created: Column(DateTime, nullable=False, default=datetime.datetime.now)
    modified: Column(DateTime, nullable=True, onupdate=datetime.datetime.now)
