# anime-scrapping

Uns testes para usar um lambda para fazer scrapping de um site de animes
A ideia é estudar um pouco mais sobre aws lambda e terraform para prover IaC. O projeto terá também como foco usar o localstack para testes

## Como usar:

Você vai precisar configurar a aws-cli, terraform, `tflocal` e o `awslocal` do localstack para usar o terraform junto com o localstack

## Construir e testar
### Construir: 
```
npm install 
npm run-script build
```

### Testar local:

Terminal 1:
```
docker compose up
```

Terminal 2:
```
cd terraform
tflocal init
tflocal apply

# teste em sí
awslocal lambda invoke --function-name lambda-anime-scrapper --cli-binary-format raw-in-base64-out --payload '{"maxPages": 10}' response.out
```

