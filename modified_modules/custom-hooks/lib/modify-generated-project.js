var util = require('util');
var fs = require('fs');
var path = require("path");
module.exports = function ($logger, hookArgs) {
    var projectData = hookArgs.projectData;
    var prepareData = hookArgs.prepareData;
    console.log("******* Prepare Data", hookArgs.prepareData);
    console.log("******* projectData Data", hookArgs.projectData);
    console.log("******* projectName", hookArgs.projectData.projectName);
    if(prepareData.platform == 'ios'){

        
        
        let iosProjectPath = path.join(projectData.platformsDir, "ios", hookArgs.projectData.projectName+".xcodeproj/project.pbxproj");
        $logger.info("Going to update generated project @" + iosProjectPath);
    
        let projectFileData = fs.readFileSync(iosProjectPath).toString();
        let result=replaceAll(projectFileData,'SUPPORTS_UIKITFORMAC = YES','SUPPORTS_UIKITFORMAC = NO');
        result=replaceAll(result, '"CODE_SIGN_IDENTITY[sdk=iphoneos*]" = "iPhone Developer";','"CODE_SIGN_IDENTITY" = "iPhone Developer";');
        
        fs.writeFileSync(iosProjectPath, result);


    } else {
        $logger.info("Not IOS doing nothing");
    }
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }