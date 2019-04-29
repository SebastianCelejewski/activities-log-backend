7z a activity-log-backend.zip *.json
aws s3 --region eu-west-1 --profile activity-log-backend-source-upload-to-s3 cp activity-log-backend.zip s3://sebcel-activity-log-backend-sources/
del activity-log-backend.zip