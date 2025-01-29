import pool from "../pool.js";

export default function Transaction(){
    let query = "BEGIN;";
    
    const add = (sub_query)=>{
        query = query.concat("\n".concat(sub_query));
    }
    
    const execute = async () =>{
        query = query.concat("\nCOMMIT;");
        await pool.query(query);
    }
    
    return{
        add,
        execute
    }
}