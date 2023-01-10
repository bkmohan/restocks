import scrapy
import json
import math

class ShoesSpider(scrapy.Spider):
    name = 'shoes'

    def start_requests(self):
        url = 'https://restocks.net/en/shop/search?q=&page=1&filters[0][match][productgroup.slug.keyword]=sneakers&filters[1][range][price][gte]=1&sort[0][baseproduct_id][order]=desc&options[getAllPages]=1'
        yield scrapy.Request(url)

    def parse(self, response):
        data = json.loads(response.text)

        total_products = data['total']
        last_page = math.ceil(total_products / 48)

        url = f'https://restocks.net/en/shop/search?q=&page={last_page}&filters[0][match][productgroup.slug.keyword]=sneakers&filters[1][range][price][gte]=1&sort[0][baseproduct_id][order]=desc&options[getAllPages]=1'

        yield scrapy.Request(url, callback=self.parse_listing)

    
    def parse_listing(self, response):
        data = json.loads(response.text)

        for product in data['data']:
            yield scrapy.Request(product['slug'], callback=self.parse_product, cb_kwargs={'product' : product})

    
    def parse_product(self, response, product):
        sizes = response.xpath('//ul[@class="select__size__list"]/li[not(@class="out__of__stock")]')

        price_list = {}
        for size in sizes:
            s = size.xpath('.//span[@class="text"]/text()').get().strip()
            price = size.xpath('.//span[contains(@class,"price")]/span[1]/text()').get().strip()
            price_list[s] = price 

        yield {
            'name' : product['name'],
            'sku' : product['sku'],
            'image' : product['image'],
            'url' : product['slug'],
            'price' : json.dumps(price_list)
        }
        print(f'Scraped {product["name"]} ({product["sku"]})')

