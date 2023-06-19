### 1. Git clone code from mintuan's account into your local laptop: 
$ git clone https://git-codecommit.ap-southeast-1.amazonaws.com/v1/repos/LMS



### 2. Download Amplify CLI:  
Follow below instructions in section "Install the Amplify CLI", and section "Configure the Amplify CLI": 
https://docs.amplify.aws/cli/start/install/#configure-the-amplify-cli 
* Note: amplify configure will ask you to sign into the AWS Console. Remember to log into your own isengard account to sign into that AWS Console.
* Step: "Specify the AWS Region" -> Choose Singapore Region.

### 3. Init Amplify and connect your local env to the Cloud:
Open your local LMS root folder, then:

$ cd lms/lms-studio

$ (sudo) amplify init

? Enter a name for the environment: dev
? Choose your default editor: <Choose your favorite editor>
Using default provider  awscloudformation
? Select the authentication method you want to use: AWS profile
? Please choose the profile you want to use : <Choose the profile you created in Configure the Amplify CLI from section 2. Download Amplify CLI>

$ amplify push


####  Similarly, do all above steps in this section 3 for lms:
Open your local LMS root folder, then:

$ cd lms/lms

$ (sudo) amplify init
...


### 4. Check your apps are on or not:
Open your own isengard account and go to "Amplify" service to check if your app is now shown on or not (apps'name:  lms, lmsstudio)   

### 5. Run Frontend  from your local laptop:
#### How to run lms FE:
Open your local LMS root folder, then:

$ cd LMS/lms/

$ npm i

$ npm start

#### How to run lms-studio FE:
Open your local LMS root folder, then:

$ cd LMS/lms-studio/

$ npm i

$ npm start

### 6. How can we contribute to the source code ?
Inside your cloned repository from section 1, create a new branch, naming convention: <branch_name_convention>

You develope, test the project with that branch.

After that, you create a pull request to the CodeCommit Git Repository in mintuan's account.

mintuan will review and merge the pull requests from everyone.

