import express from "express";
import createError from "http-errors";
import { AuthSchema } from "../config/Validation/auth";
import MySQL from "../config/Init/initTypeMySQL";

export default {
    createProduct: async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            //Setup
            const {
                username,
                name,
                id,
                msrp,
                reorderCount,
                orderNumber
            } = req.body;

            var mysql = require('mysql2');
            var con = await mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "password",
                port: 3306,
                database: "databaseproject"
            });

            //Get supplier ID
            let query = `\
            SELECT \n\
            	suppliers.supplierID,\n\
                addresses.addressID\n\
            FROM (Suppliers, Addresses)\n\
            WHERE\n\
            	username = "Bencraft"\n\
                AND Addresses.userType = 2\n\
                AND Addresses.active = true\n\
                AND Addresses.userID = suppliers.supplierID;`;

            console.log(query);
            con.connect(function(err) {
                if(err) throw err;
                con.query(query, function(err, result) {
                    if(err) throw err;

                    if(result[0].supplierID) {
                        let userid = result[0].supplierID;
                        let addressid = result[0].addressID;

                        //Make sure no duplicate product ids for the same supplier
                        let query = `\
                        SELECT COUNT(*)\n\
                        FROM Suppliers, Products
                        WHERE\n\
                            suppliers.supplierID = ${userid}\n\
                            AND supplierCode = \"${id}\";`

                        con.connect(function(err) {
                            if(err) throw err;
                            con.query(query, function(err, result) {
                                if(err) throw err;

                                if(result[0][`COUNT(*)`] !=0) {
                                    console.log(result[0][`COUNT\(*\)`]);
                                    res.json({failed: "Error: Product already exists."});
                                } else {

                                    //Create insert query
                                    let query = "";

                                    if(reorderCount) {
                                        if(!orderNumber) {
                                            res.json({Error:  "If automatic reorder is active, product count must be specified!"});
                                        } else {
                                            query = `\
                                            INSERT INTO Products (\n\
                                                supplierID,\n\
                                                supplierCode,\n\
                                                MSRP,\n\
                                                name,\n\
                                                listPrice,\n\
                                                reorderAtCount,\n\
                                                orderCount\n\,
                                                count,\n\
                                                addressID
                                            )\n\
                                            VALUES (\n\
                                                ${userid},\n\
                                                \"${id}\",\n\
                                                ${msrp},\n\
                                                \"${name}\",\n\
                                                ${msrp},\n\
                                                ${reorderCount},\n\
                                                ${orderNumber},\n\
                                                100,\n\
                                                ${addressid}\n\
                                            )`
                                        }
                                    } else if(orderNumber) {
                                        query = `\
                                        INSERT INTO Products (\n\
                                            supplierID,\n\
                                            supplierCode,\n\
                                            MSRP,\n\
                                            name,\n\
                                            listPrice,\n\
                                            orderCount,\n\
                                            count\n\
                                        )\n\
                                        VALUES (\n\
                                            ${userid},\n\
                                            \"${id}\",\n\
                                            ${msrp},\n\
                                            \"${name}\",\n\
                                            ${msrp},\n\
                                            ${orderNumber},\n\
                                            100\n\
                                        )`
                                    } else {
                                        query = `\
                                        INSERT INTO Products (\n\
                                            supplierID,\n\
                                            supplierCode,\n\
                                            MSRP,\n\
                                            name,\n\
                                            listPrice,\n\
                                            count\n\
                                        )\n\
                                        VALUES (\n\
                                            ${userid},\n\
                                            \"${id}\",\n\
                                            ${msrp},\n\
                                            \"${name}\",\n\
                                            ${msrp},\n\
                                            100\n\
                                        )`
                                    }

                                    con.connect(function(err) {
                                        if(err) throw err;
                                        con.query(query, function (err, result) {
                                            if(err) throw err;
                                            res.json({success: "Product successfully added!"});
                                        });
                                    });
                                }
                            });
                        });

                        

                    }
                });
            });
        } catch (error) {
            res.json({error: "Error.  Cannot create product!"});
        }
    }
}