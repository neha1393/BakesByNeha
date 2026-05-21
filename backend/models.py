from sqlalchemy import Column, Integer, String, Text, Float
from database import Base

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True)
    name = Column(String)
    servings = Column(Integer)
    image = Column(String)
    ingredients = Column(Text)
    instructions = Column(Text)


class Stock(Base):
    __tablename__ = "stock"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    bought_qty = Column(Float)
    unit = Column(String)
    total_price = Column(Float)