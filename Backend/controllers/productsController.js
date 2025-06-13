import Product from "../models/product.model.js";


const handleNewProduct = async (req, res) => {
    const { type, title, price, details, reviews, ratings, imgURL, img2, img3, img4 } = req.body;
    if(!type || !title || !price || !details || !imgURL) return res.status(400).json({'message' : 'Enter all required fields'})
    
    const duplicate =  await Product.findOne({title}).exec() 
    
    if(duplicate) return res.sendStatus(409) // conflict

    try{
        const result =  await Product.create({
             type, title, price, details, reviews, ratings, imgURL, img2, img3, img4
        })
        console.log(result)
        res.status(201).json({'success': `${title} added!`})
    } catch(err){
        res.status(500).json({'message': err.message})
    }
}

const getAllProducts = async (req, res) =>{
    const products = await Product.find()
    if(!products) return res.status(204).json({'message': 'No products found'}) // no content
    res.json(products)
}

const getProduct = async (req, res)=>{
    if(!req?.params?.id){
        return res.status(400).json({ "message": 'ID parameter is required' });
    }
    const product = await Product.findOne({ _id : req.params.id}).exec()
    if (!product) {
        return res.status(204).json({ "message": `No product matches ${req.param.id}` });
    }
    res.json(product);
}

export  {handleNewProduct, getAllProducts, getProduct}