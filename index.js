const express = require('express');
const cors = require('cors');
const mysql = require('promise-mysql2');
const fileUpload = require('express-fileupload');

const app = express();
const PORT = 5000;


app.use(express.urlencoded({ extended: true, }));
app.use(express.json());
app.use(
    fileUpload({
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
        abortOnLimit: true,
    })
);
app.use(cors({
    origin: [
        `http://localhost:8080`
    ],
    credentials: false
}));

const ingredients = [
    "Banana Blossom", "Beans", "Bell pepper", "Bouillon", "Breadcrumbs", "Breading Mix", "Butter", "Cabbage", "Calamansi", "Canton",
    "Carrots", "Celery", "Cheese", "Chickpeas", "Chili Pepper", "Cinamon", "Coconut Milk", "Corn", "Cornstarch",
    "Cream", "Cream of mushroom", "Curry", "Egg", "Flour", "Garlic", "Ginger", "Gluten", "Green Chili Pepper", "Green Onions",
    "Hony", "Laurel leaf", "Luncheon Meat", "Margarine", "Mayonnaise", "Milk", "Moringa", "Mung (Mongo) Beans", "Mushroom", "Nestle cream",
    "Oil", "Onion", "Oregano", "Oyster Sauce", "Patola", "Peanut", "Peas", "Pepper", "Potato", "Pumpkin",
    "Raisin", "Red Chili", "Sayote", "Scallop", "Sili Haba", "Sotanghon", "Soy sauce", "Spag sauce", "Spaghetti (Pasta)", "Sugar",
    "Tofu", "Tomato", "Tomato sauce", "Turnip", "Vegemeat", "Vinegar", "White Beans", "White Onion", "Green Beans"
]

const products = ["Beans", "Mixed Vegetables", "Noodles", "Pasta", "Tofu", "Vegemeat"]

const productsWithBarcode = [
    {
        name: "FF Pande Coco",
        barcode: 10009124
    },
    {
        name: "FF Camachile",
        barcode: 10009122
    },
    {
        name: "FF Pinagong Single",
        barcode: 1660
    },
    {
        name: "FF Spanish Bread",
        barcode: 4220
    },
    {
        name: "FF Diner Roll",
        barcode: 7626
    },
    {
        name: "FF Pandesiosa",
        barcode: 10000283
    },

]


const lists = [
    {
        name: "Beans",
        ingredients: [
            "White Beans", "Onion", "Oil", "Tomato sauce", "Chickpeas", "Curry",
        ]
    },
    {
        name: "Mixed Vegetables",
        ingredients: [
            "Banana Blossom", "Butter", "Cabbage", "Carrots", "Coconut Milk", "Corn", "Cream of mushroom", "Ginger",
            "Green Chili Pepper", "Green Beans", "Moringa", "Mushroom", "Potato", "Pumpkin", "Sayote", "Turnip",

        ]
    },
    {
        name: "Noodles",
        ingredients: [
            "Canton", "Cabbage", "Carrots", "Celery", "Egg", "Green Onions",
            "Mung (Mongo) Beans", "Onion", "Patola", "Sili Haba", "Sotanghon", "Tofu",
        ]
    },
    {
        name: "Pasta",
        ingredients: [
            "Cream of mushroom", "Cheese", "Cream", "Milk", "Mushroom", "Onion",
            "Spaghetti (Pasta)", "Peanut", "Spag sauce", "Tomato sauce", "Vegemeat",
        ]
    },
    {
        name: "Tofu",
        ingredients: [
            "Cream", "Breadcrumbs", "Carrots", "Celery", "Cinamon", "Cream of mushroom",
            "Egg", "Milk", "Garlic", "Ginger", "Gluten", "Honey",
            "Mayonnaise", "Mushroom", "Oregano", "Oyster Sauce", "Pepper", "Red Chili",
            "Soy sauce", "Sugar", "Tofu", "Vinegar", "White Onion",
        ]
    },
    {
        name: "Vegemeat",
        ingredients: [
            "Beans", "Bell pepper", "Bouillon", "Breadcrumbs", "Breading Mix", "Butter", "Calamansi",
            "Carrots", "Cheese", "Chili Pepper", "Coconut Milk", "Cornstarch", "Egg", "Flour",
            "Garlic", "Ginger", "Gluten", "Laurel leaf", "Luncheon Meat", "Margarine", "Oil",
            "Onion", "Oyster Sauce", "Peas", "Pepper", "Potato", "Raisin", "Red Chili",
            "Scallop", "Soy sauce", "Tofu", "Tomato", "Vegemeat",
        ]
    }
]

const dbConfig = {
    host: 'sql.freedb.tech',
    port: 3306,
    user: 'admin',
    password: 'admin',
    database: 'freedb_Allertify'
};

//create a new connection to the databse
const ConnectToDatabase = async () => {
    let connection = mysql.createConnection(dbConfig);
    return connection;
}

//end the connection with the database
const EndConnection = (connection) => {
    connection.end();
}

//execute the query
async function Query(sql, parms) {
    try {
        let conn = await ConnectToDatabase()
        let [result,] = await conn.query(sql, parms);
        EndConnection(conn);
        return result;
    } catch (e) {
        console.log('An error occured', e)
    }
}

app.use(express.urlencoded({ extended: true, }));
app.use(express.static('public'));
app.use(express.json());


const saveAllIngredients = async (req, res, next) => {
    for (let ingredient of ingredients) {
        await Query(
            'INSERT INTO ingredient (name) VALUE (?)',
            [ingredient]
        )
    }
    res.json({ message: 'success' })
}

const saveAllProducts = async (req, res, next) => {
    for (let product of products) {
        await Query(
            'INSERT INTO product (name) VALUE (?)',
            [product]
        )
    }
    res.json({ message: 'success' })
}

const saveProductsWithBarcode = async (req, res, next) => {
    for (let product of productsWithBarcode) {
        await Query(
            'INSERT INTO product (name, barcode) VALUE (?, ?)',
            [product.name, product.barcode]
        )
    }
    res.json({ message: 'success' })
}


const saveLists = async (req, res, next) => {
    for (let list of lists) {
        let [product,] = await Query("SELECT ID FROM product WHERE name = ?", [list.name])
        for (let ingred of list.ingredients) {
            let [ingredient,] = await Query("SELECT ID FROM ingredient WHERE name = ?", [ingred])
            await Query(
                'INSERT INTO ingredients_list (product_ID, ingredient_ID) VALUES (?, ?)',
                [product.ID, ingredient.ID]
            )
        }
    }
    res.json({ message: 'success' })
}

const postImage = (req, res, next) => {
    console.log(req.files)
    const img = req.files.image;

    //save img
    // If no image submitted, exit
    if (!img)
        return res.status(400).json({ error: 'no image found' });

    const imgPath = __dirname + '/uploads/' + img.name;

    // Move the uploaded image to our upload folder
    img.mv(imgPath);
    res.status(200).json({ message: 'success' })
}


app.post('/ingredients', saveAllIngredients)
app.post('/products', saveAllProducts)
app.post('/lists', saveLists)
app.post('/barcode', saveProductsWithBarcode)

app.get('/', async (req, res, next) => {
    try {
        let conn = await ConnectToDatabase()
    } catch (e) {
        console.log('An error occured', e)
    }
    res.json({ message: 'Connected' })
    EndConnection(conn);
    return result;
})

app.post('/image', postImage)
app.get('/', (req, res, next) => {
    console.log('getting called')
    res.json({ message: 'success' })
})

app.listen(PORT)