from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import json

from database import engine, get_db, Base
from models import Recipe, Stock

app = FastAPI()

@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Seed Recipes ──
def seed_recipes(db: Session):
    if db.query(Recipe).count() > 0:
        return
    recipes_data = [
        {
            "key": "chocolate_cake",
            "name": "Chocolate Cake",
            "servings": 8,
            "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500",
            "ingredients": {"flour": "2 cups", "sugar": "1.5 cups", "cocoa powder": "0.5 cups", "butter": "0.5 cups", "eggs": "3", "milk": "1 cup", "baking powder": "1.5 tsp"},
            "instructions": "Mix dry ingredients. Add butter, eggs and milk. Pour into pan. Bake at 180C for 30 mins."
        },
        {
            "key": "cookies",
            "name": "Cookies",
            "servings": 24,
            "image": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500",
            "ingredients": {"flour": "2.25 cups", "sugar": "0.75 cups", "butter": "1 cup", "eggs": "2", "chocolate chips": "2 cups", "vanilla extract": "1 tsp", "baking soda": "1 tsp"},
            "instructions": "Cream butter and sugar. Add eggs and vanilla. Mix in flour and chocolate chips. Bake at 190C for 10 mins."
        },
        {
            "key": "brownie",
            "name": "Brownie",
            "servings": 16,
            "image": "https://images.unsplash.com/photo-1515037893149-de7f840978e2?w=500",
            "ingredients": {"butter": "0.5 cups", "sugar": "1 cup", "cocoa powder": "0.33 cups", "eggs": "2", "flour": "0.5 cups", "vanilla extract": "1 tsp", "salt": "0.25 tsp"},
            "instructions": "Melt butter, mix in sugar and cocoa. Add eggs and vanilla. Fold in flour. Bake at 175C for 25 mins."
        },
        {
            "key": "vanilla_cake",
            "name": "Vanilla Cake",
            "servings": 10,
            "image": "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500",
            "ingredients": {"flour": "2.5 cups", "sugar": "1.5 cups", "butter": "0.75 cups", "eggs": "4", "milk": "1 cup", "vanilla extract": "2 tsp", "baking powder": "2.5 tsp"},
            "instructions": "Beat butter and sugar. Add eggs and vanilla. Alternate adding flour and milk. Bake at 180C for 35 mins."
        },
        {
            "key": "cheesecake",
            "name": "Cheesecake",
            "servings": 12,
            "image": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500",
            "ingredients": {"cream cheese": "500g", "sugar": "0.75 cups", "eggs": "3", "vanilla extract": "1 tsp", "graham crackers": "1.5 cups", "butter": "0.25 cups", "sour cream": "0.5 cups"},
            "instructions": "Make crust with crackers and butter. Beat cream cheese, sugar, eggs. Pour over crust. Bake at 160C for 55 mins."
        }
    ]
    for r in recipes_data:
        recipe = Recipe(
            key=r["key"], name=r["name"], servings=r["servings"],
            image=r["image"], ingredients=json.dumps(r["ingredients"]),
            instructions=r["instructions"]
        )
        db.add(recipe)
    db.commit()


# ── Seed Stock ──
def seed_stock(db: Session):
    if db.query(Stock).count() > 0:
        return
    stock_data = [
        {"name": "Maida",           "bought_qty": 5000, "unit": "grams", "total_price": 500},
        {"name": "Sugar",           "bought_qty": 2000, "unit": "grams", "total_price": 160},
        {"name": "Butter",          "bought_qty": 1000, "unit": "grams", "total_price": 400},
        {"name": "Cocoa Powder",    "bought_qty": 500,  "unit": "grams", "total_price": 200},
        {"name": "Milk",            "bought_qty": 1000, "unit": "grams", "total_price": 60},
        {"name": "Eggs",            "bought_qty": 12,   "unit": "pieces","total_price": 84},
        {"name": "Baking Powder",   "bought_qty": 100,  "unit": "grams", "total_price": 40},
        {"name": "Vanilla Extract", "bought_qty": 100,  "unit": "grams", "total_price": 120},
        {"name": "Cream Cheese",    "bought_qty": 500,  "unit": "grams", "total_price": 350},
        {"name": "Chocolate Chips", "bought_qty": 500,  "unit": "grams", "total_price": 250},
    ]
    for s in stock_data:
        stock = Stock(**s)
        db.add(stock)
    db.commit()


# ── Recipe Routes ──
@app.get("/")
def home():
    return {"message": "Welcome to BakesByNeha API 🧁"}

@app.get("/recipes")
def get_all_recipes(db: Session = Depends(get_db)):
    seed_recipes(db)
    recipes = db.query(Recipe).all()
    result = {}
    for r in recipes:
        result[r.key] = {
            "id": r.id, "name": r.name, "servings": r.servings,
            "image": r.image, "ingredients": json.loads(r.ingredients),
            "instructions": r.instructions
        }
    return result

@app.get("/recipes/{recipe_name}")
def get_recipe(recipe_name: str, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.key == recipe_name).first()
    if not recipe:
        return {"error": f"Recipe '{recipe_name}' not found!"}
    return {
        "id": recipe.id, "name": recipe.name, "servings": recipe.servings,
        "image": recipe.image, "ingredients": json.loads(recipe.ingredients),
        "instructions": recipe.instructions
    }


# ── Stock Routes ──
@app.get("/stock")
def get_stock(db: Session = Depends(get_db)):
    seed_stock(db)
    stocks = db.query(Stock).all()
    return [
        {
            "id": s.id,
            "name": s.name,
            "bought_qty": s.bought_qty,
            "unit": s.unit,
            "total_price": s.total_price,
            # price per single unit (per gram or per piece)
            "price_per_unit": round(s.total_price / s.bought_qty, 4)
        }
        for s in stocks
    ]