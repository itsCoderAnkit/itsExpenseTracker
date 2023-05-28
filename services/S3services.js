
const AWS = require('aws-sdk')

const uploadtoS3 = async (data, filename) =>{
    const BUCKET_NAME = 'expensestrackerapp123'
    const IAM_USER_KEY = 'IAM_USER_KEY'
    const IAM_USER_SECRET = 'IAM_USER_SECRET'

    let S3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET

    })

    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }

    return new Promise((resolve, reject) => {
        S3bucket.upload(params, (err, S3response) => {
            if (err) {
                console.log('something went wrong')
                reject(err)
            }
            else {
                console.log('success', S3response)
                resolve(S3response.Location)
            }
        })
    })
}


module.exports={
    uploadtoS3
}
