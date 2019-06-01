echo Removing previous build artifacts
del /Q build\*.*

echo Creating build artifacts
call 7z a build/activity-log-backend.zip ./src/cloudformation/*.*
call 7z a build/CreateDutyTypeFunction.zip ./src/lambda/CreateDutyTypeFunction.js
call 7z a build/DeleteDutyDataFunction.zip ./src/lambda/DeleteDutyDataFunction.js
call 7z a build/GetDutiesFunction.zip ./src/lambda/GetDutiesFunction.js
call 7z a build/GetDutyTypesFunction.zip ./src/lambda/GetDutyTypesFunction.js
call 7z a build/SaveDutyDataFunction.zip ./src/lambda/SaveDutyDataFunction.js

echo Uploading build artifacts to S3
call aws s3 --region eu-west-1 --profile activity-log-backend-source-upload-to-s3 cp build/CreateDutyTypeFunction.zip s3://sebcel-activity-log-backend-sources/
call aws s3 --region eu-west-1 --profile activity-log-backend-source-upload-to-s3 cp build/DeleteDutyDataFunction.zip s3://sebcel-activity-log-backend-sources/
call aws s3 --region eu-west-1 --profile activity-log-backend-source-upload-to-s3 cp build/GetDutiesFunction.zip s3://sebcel-activity-log-backend-sources/
call aws s3 --region eu-west-1 --profile activity-log-backend-source-upload-to-s3 cp build/GetDutyTypesFunction.zip s3://sebcel-activity-log-backend-sources/
call aws s3 --region eu-west-1 --profile activity-log-backend-source-upload-to-s3 cp build/SaveDutyDataFunction.zip s3://sebcel-activity-log-backend-sources/

echo Uploading stack configuration to S3
call aws s3 --region eu-west-1 --profile activity-log-backend-source-upload-to-s3 cp build/activity-log-backend.zip s3://sebcel-activity-log-backend-sources/

echo Done