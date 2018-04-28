# CentralCascadeAutoSales
test backend for auto sales site

## Main Central Cascades Automotive Sales server:  server/server.js
    routes:
        GET /orders         Lists all orders in database.
        POST /order         Places an order expects object {make, model, package, customer_id}. 
                            Returns results and if successful, a link where the order can be downloaded.
        GET /download/:id   Allows downloading of json file id.json.

## Secure Central Cascades Automotive Sales server: serverSecure.js
    routes:
        GET /orders         Lists all orders in database.  Must have x-auth token set to value from login or create user to view.
        POST /order         Places an order expects object {make, model, package, customer_id}. 
                            Returns results and if successful, a link where the order can be downloaded.
        GET /download/:id   Allows downloading of json file id.json.
        POST /users         Allows creation of user and returns token. Expects {email, password}
        POST /users/login   Validates password then creates token and returns it.  Expects {email, password}
        DELETE /users/me/token Removes users token (logs them out). Must have x-auth token in header set to call.

    test secure server: 
        To test this server, first create a user for yourself through POST to /users.  
        Then grab the auth token returned in the header.
        Use that token to put in the header as x-auth for any secured routes which are the 
        GET /orders and DELETE /users/me/token

## Placing orders:
The placing of orders to the suppliers is actually achieved through a separate task.  When an order is placed, it is given a field of 'order_placed_to_suplier' that is set to false.  When the supplier order task is ran, it finds any orders in the database that have that flagged as false and then processes them.  If successful, it will then set it to true as well as setting a suplier_order_id field.


## Supplier servers:

    server/serverACME.js
        routes:
            POST /order     Places order to suplier.  Expects object {api_key, model, package}
                                api_key must be 'cascade.53bce4f1dfa0fe8e7ca126f91bs5d3a6'
                                model must be one of (anvil, wile, roadrunner)
                                package must be one of (std, super, elite)

    server/serverRTS.js
        routes:
            POST /nonce_token   Returns a one time user token to requestor in form of {nonce_token: token}
            POST/ /request_customized_model
                                Checks token and places order if correct.  Expects {token, model, package}
                                model must be one of (pugetsound, olympic)
                                package must be one of (mtn, ltd, 14k)



