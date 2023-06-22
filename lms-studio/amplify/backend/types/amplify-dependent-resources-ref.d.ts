export type AmplifyDependentResourcesAttributes = {
    "api": {
        "lmsStudio": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        }
    },
    "auth": {
        "lmsstudioc3fd255f": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        }
    },
    "function": {
        "studioCourses": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string",
            "LambdaExecutionRoleArn": "string"
        }
    },
    "storage": {
        "studioLectureVideos": {
            "BucketName": "string",
            "Region": "string"
        }
    }
}