-- Data in nested JSON form:
--
-- {
--     "username": "oliver",
--     "postcode": "SL95GH",
--     "dob": "1990-01-20",
--     "baskets": [
--         {
--             "created_date": "2017-01-03",
--             "total_price_cents": 760,
--             "purchases": [
--                 {
--                     "product": {
--                         "name": "banana",
--                         "price_cents": 120
--                     },
--                     "qty": 3
--                 },
--                 {
--                     "product": {
--                         "name": "ham",
--                         "price_cents": 400
--                     },
--                     "qty": 1
--                 }
--             ]
--         },
--         {
--             "created_date": "2017-01-04",
--             "total_price_cents": 180,
--             "purchases": [
--                 {
--                     "product": {
--                         "name": "apple",
--                         "price_cents": 90
--                     },
--                     "qty": 2
--                 }
--             ]
--         }
--     ]
-- }
--
-- {
--     "username": "tom",
--     "postcode": "NW126GH",
--     "dob": "1957-11-03",
--     "baskets": []
-- }
--
-- {
--     "username": "harry",
--     "postcode": "HU2T54",
--     "dob": "1983-05-11",
--     "baskets": [
--         {
--             "created_date": "2017-01-07",
--             "total_price_cents": 1600,
--             "purchases": [
--                 {
--                     "product": {
--                         "name": "ham",
--                         "price_cents": 400
--                     },
--                     "qty": 4
--                 }
--             ]
--         },
--         {
--             "created_date": "2017-01-08",
--             "total_price_cents": 0,
--             "purchases": []
--         }
--     ]
-- }


-- Schema

CREATE TABLE IF NOT EXISTS customer (
    customer_id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    postcode TEXT NOT NULL,
    dob DATE NOT NULL
);
CREATE TABLE IF NOT EXISTS product (
    product_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price_cents INT NOT NULL
);
CREATE TABLE IF NOT EXISTS basket (
    basket_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customer(customer_id) ON DELETE CASCADE NOT NULL,
    created_date DATE NOT NULL
);
CREATE TABLE IF NOT EXISTS purchase (
    purchase_id SERIAL PRIMARY KEY,
    basket_id INT REFERENCES basket(basket_id) ON DELETE CASCADE NOT NULL,
    product_id INT REFERENCES product(product_id) ON DELETE CASCADE NOT NULL,
    qty INT NOT NULL
);


-- Insert data

INSERT INTO customer VALUES
(1, 'oliver', 'SL95GH', '1990-01-20'),
(2, 'tom', 'NW126GH', '1957-11-03'),
(3, 'harry', 'HU2T54', '1983-05-11');
INSERT INTO product VALUES
(1, 'banana', 120),
(2, 'apple', 90),
(3, 'ham', 400);
INSERT INTO basket VALUES
(1, 1, '2017-01-03'),
(2, 1, '2017-01-04'),
(3, 3, '2017-01-07'),
(4, 3, '2017-01-08');
INSERT INTO purchase VALUES
(1, 1, 1, 3),
(2, 1, 3, 1),
(3, 2, 2, 2),
(4, 3, 3, 4);


-- Example queries

SELECT
    customer.customer_id,
    customer.username,
    customer.postcode,
    customer.dob,
    basket.basket_id,
    basket.customer_id,
    basket.created_date,
    purchase.purchase_id,
    purchase.basket_id,
    purchase.product_id,
    purchase.qty,
    product.product_id,
    product.name,
    product.price_cents
FROM customer
LEFT OUTER JOIN basket ON customer.customer_id = basket.customer_id
LEFT OUTER JOIN purchase ON basket.basket_id = purchase.basket_id
LEFT OUTER JOIN product ON product.product_id = purchase.product_id;

SELECT json_build_object(
    'username', customer.username,
    'postcode', customer.postcode,
    'dob', customer.dob,
    'baskets', CASE WHEN count(basket_.*) > 0
        THEN json_agg(basket_.json_ ORDER BY basket_.created_date)
        ELSE '[]'::JSON END
)
FROM customer
LEFT OUTER JOIN (
    SELECT
        basket.customer_id,
        basket.created_date,
        json_build_object(
            'created_date', basket.created_date,
            'total_price_cents', coalesce(sum(purchase_.product_price_cents * purchase_.qty), 0),
            'purchases', CASE WHEN count(purchase_.*) > 0
                THEN json_agg(purchase_.json_)
                ELSE '[]'::JSON END
        ) AS json_
    FROM basket
    LEFT OUTER JOIN (
        SELECT
        purchase.basket_id,
        purchase.qty,
        product.price_cents AS product_price_cents,
        json_build_object(
            'product', json_build_object(
                'name', product.name,
                'price_cents', product.price_cents
            ),
            'qty', purchase.qty
        ) AS json_
        FROM purchase
        JOIN product using(product_id)
    ) AS purchase_ using(basket_id)
    GROUP BY basket.customer_id, basket.created_date
) AS basket_ using(customer_id)
GROUP BY customer.customer_id, customer.username, customer.postcode, customer.dob
ORDER BY customer.customer_id;
