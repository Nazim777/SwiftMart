** before creating schema
1. npx prisma init

** after creating schema
2. npx prisma generate
3.  npx prisma migrate dev --name add_product_relation
after making changes to the existing prisma schema run this two command
1. npx prisma generate
2. npx prisma migrate dev
3. npx prisma db push