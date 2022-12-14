variable "aws_region" {
  type        = string
  description = ""
  default     = "us-east-1"
}

variable "aws_profile" {
  type        = string
  description = ""
  default     = "pessoal"
}

variable "environment" {
  type        = string
  description = "Ambiente"
  default     = "DEV"
}

variable "lambda_name" {
  type = string
  description = "Nome do Lambda"
  default = "lambda-anime-scrapper"
}

variable "dynamodb_table_name" {
  type = string
  description = "Nome da tabela no dynamodb"
  default = "AnimeList"
}