const express=require('express');
const router=express.Router();

router.get('/',(req,res) => {
   obj={
    name:'chiranjit',
    number:35
   }
  res.json(obj);
})

module.exports=router;