aws cloudformation^
	--region eu-west-1^
	--profile activity-log-backend-update-pipeline-stack^
	update-stack^
	--stack-name activity-log-backend-pipeline-stack^
	--template-body file://pipeline/activity-log-backend-pipeline-stack.yml^
	--capabilities CAPABILITY_NAMED_IAM^
	--parameters ParameterKey=Email,ParameterValue=Sebastian.Celejewski@wp.pl
