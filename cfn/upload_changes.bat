echo Removing previous build artifacts
del /Q build\*.*

echo Creating build artifacts
7z a build/activity-log-backend.zip ./application-stack/*.*
7z a build/CreateDutyTypeFunction.zip ./src/CreateDutyTypeFunction.js
7z a build/DeleteDutyDataFunction.zip ./src/DeleteDutyDataFunction.js
7z a build/GetDutiesFunction.zip ./src/GetDutiesFunction.js
7z a build/GetDutyTypesFunction.zip ./src/GetDutyTypesFunction.js
7z a build/SaveDutyDataFunction.zip ./src/SaveDutyDataFunction.js

echo Uploading build artifacts to S3
aws s3 --region eu-west-1 --profile activity-log-backend-source-upload-to-s3 cp build/CreateDutyTypeFunction.zip s3://sebcel-activity-log-backend-sources/
aws s3 --region eu-west-1 --profile activity-log-backend-source-upload-to-s3 cp build/DeleteDutyDataFunction.zip s3://sebcel-activity-log-backend-sources/
aws s3 --region eu-west-1 --profile activity-log-backend-source-upload-to-s3 cp build/GetDutiesFunction.zip s3://sebcel-activity-log-backend-sources/
aws s3 --region eu-west-1 --profile activity-log-backend-source-upload-to-s3 cp build/GetDutyTypesFunction.zip s3://sebcel-activity-log-backend-sources/
aws s3 --region eu-west-1 --profile activity-log-backend-source-upload-to-s3 cp build/SaveDutyDataFunction.zip s3://sebcel-activity-log-backend-sources/

echo Uploading stack configuration to S3
aws s3 --region eu-west-1 --profile activity-log-backend-source-upload-to-s3 cp build/activity-log-backend.zip s3://sebcel-activity-log-backend-sources/

echo Done