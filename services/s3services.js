const AWS = require('aws-sdk');
require('dotenv').config()

module.exports.uploadToS3 = (fileContent,filename)=>{
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    let s3bucket = new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET
    })
    let params = {
        Bucket: BUCKET_NAME,
        Key:filename,
        Body:fileContent,
        ACL:'public-read'
    }
    return new Promise((resolve,reject)=>{
        s3bucket.upload(params,(err,response)=>{
            if(err){
                console.log('something went wrong',err);
                reject(err)
            }
            else{
                console.log('success',response);
                resolve(response.Location);
            }
        })
    })
}