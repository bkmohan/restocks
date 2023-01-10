# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
import psycopg2
from datetime import datetime, timezone
import logging

class RestocksscraperPipeline:
    def process_item(self, item, spider):
        return item


class RestocksPostgreSqlPipeline:

    def __init__(self, settings):
        self.hostname = settings.get('HOSTNAME')
        self.username = settings.get('USERNAME')
        self.password = settings.get('PASSWORD')
        self.database = settings.get('DATABASE')

    @classmethod
    def from_crawler(cls, crawler):
        settings = crawler.settings
        return cls(settings)

    def open_spider(self, spider):
        try:
            self.connection = psycopg2.connect(
                                host=self.hostname, 
                                user=self.username, 
                                password=self.password,
                                dbname=self.database)
            
            self.cursor = self.connection.cursor()
            
            product_table = '''
                            CREATE TABLE IF NOT EXISTS products (
                                name text NOT NULL,
                                sku text NOT NULL,
                                image text,
                                url text,
                                PRIMARY KEY (sku)
                                )
            '''

            price_table = '''
                            CREATE TABLE IF NOT EXISTS price (
                                sku text NOT NULL,
                                price text,
                                timestamp TIMESTAMPTZ
                                )
            '''

            self.cursor.execute(product_table)
            self.cursor.execute(price_table)
            self.connection.commit()

            self.cursor.execute("SELECT sku FROM products")
            self.skus = [record[0] for record in self.cursor.fetchall()]

        except Exception as e:
            print(e)
            self.connection.rollback()
            logging.error(e)
            raise

        


    def close_spider(self, spider):
        self.cursor.close()
        self.connection.close()

    def process_item(self, item, spider):
        try:
            if item['sku'] not in self.skus:
                insert_query = f'''
                                INSERT INTO products (name, sku, image, url) values(%s,%s,%s,%s)
                            '''
                self.cursor.execute(insert_query, (item['name'],item['sku'],item['image'],item['url']))
                self.connection.commit()
                self.skus.append(item['sku'])

            insert_price_query = f'''
                                INSERT INTO price (sku, price, timestamp) values(%s,%s,%s)
                            '''
            self.cursor.execute(insert_price_query, (item['sku'],item['price'],datetime.now(timezone.utc)))
            self.connection.commit()

        except Exception as e:
            self.connection.rollback()
            logging.error(e)
            raise
        return item