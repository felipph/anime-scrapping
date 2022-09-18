resource "aws_dynamodb_table" "anime_list_table" {
  provider       = aws
  name           = var.dynamodb_table_name
  billing_mode   = "PROVISIONED"
  read_capacity  = "100"
  write_capacity = "100"
  attribute {
    name = "itemId"
    type = "S"
  }
  hash_key = "itemId"
}
