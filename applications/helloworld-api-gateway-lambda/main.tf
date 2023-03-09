module "helloworld-apigateway" {
  source = "../../modules/api-gateway"

  api_gateway_name          = "helloworld-api"
  api_gateway_resource_name = ["helloworld", "lookup"]
  lambda_functions_invoke_arn = module.helloworld-lambda.lambda_functions_invoke_arn
}

module "helloworld-lambda" {
  source = "../../modules/lambda"

  lambda_function_name      = ["Helloworld", "lookup"]
  aws_iam_role_name         = "LambdaWithApiGateway"
  s3_bucket_name            = "petlover-tf-lambda"
  lambda_zipfile_name       = ["helloworld.zip", "lookup.zip"] // must be loaded to your s3 bucket before run terraform apply
  #  lambda_handler name should be same as the zip file name
  lambda_handler =  ["index_homework.handler", "index_getname.handler"]
  lambda_description = ["helloworld lambda", "lookup only lambda"]
  api_gateway_execution_arn = module.helloworld-apigateway.api_gateway_execution_arn
  s3_resources = ["arn:aws:s3:::petlover-tf-lambda", "arn:aws:s3:::petlover-tf-state-test"]
  dynamodb_table_arn = module.helloworld-dynamodb.dynamodb_table_arn
}

module "helloworld-dynamodb" {
  source = "../../modules/dynamodb"

  tableName = "HelloWorldTable" 
  attributes = ["id", "name"]
}