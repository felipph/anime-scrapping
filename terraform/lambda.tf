data "archive_file" "receiver_lambda_app" {
  type             = "zip"
  source_dir       = "../dist/"
  output_file_mode = "0666"
  output_path      = "./function.zip"
}

# Primeiro a ROLE do lambda
resource "aws_iam_role" "lambda_iam" {
  name               = var.lambda_name
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

# Lambda em sí
resource "aws_lambda_function" "lambda_anime_scrapper" {
  function_name    = var.lambda_name
  role             = aws_iam_role.lambda_iam.arn
  handler          = "index.lambdaHandler"
  runtime          = "nodejs16.x"
  timeout          = 300
  memory_size      = 1024
  filename         = data.archive_file.receiver_lambda_app.output_path
  source_code_hash = data.archive_file.receiver_lambda_app.output_base64sha256
  environment {
    variables = {
      env       = var.environment
      MAX_PAGES = 10
    }
  }
}

#Cloudwatch
resource "aws_cloudwatch_log_group" "example" {
  name              = "/aws/lambda/${aws_lambda_function.lambda_anime_scrapper.function_name}"
  retention_in_days = 14
}

# policy para log do lambda no cloudwatch
resource "aws_iam_policy" "lambda_logging" {
  name        = "lambda_logging"
  path        = "/"
  description = "IAM policy for logging - ${aws_lambda_function.lambda_anime_scrapper.function_name}}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_iam.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}
