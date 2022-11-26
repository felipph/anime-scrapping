resource "aws_dynamodb_table" "anime_list_table" {
  provider       = aws
  name           = var.dynamodb_table_name
  billing_mode   = "PROVISIONED"
  read_capacity  = "25"
  write_capacity = "25"
  attribute {
    name = "itemId"
    type = "S"
  }
  hash_key = "itemId"
}
