const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3')

const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

const awsS3BucketRegion = process.env.AWS_S3_BUCKET_REGION
const awsS3BucketAccessKey = process.env.AWS_S3_BUCKET_ACCESS_KEY
const awsS3BucketSecretAccessKey = process.env.AWS_S3_BUCKET_SECRET_ACCESS_KEY
const awsS3BucketName = process.env.AWS_S3_BUCKET_NAME

const client = new S3Client({
  credentials: {
    accessKeyId: awsS3BucketAccessKey,
    secretAccessKey: awsS3BucketSecretAccessKey
  },
  region: awsS3BucketRegion
})

const getDocumentUrl = (file) =>
  new Promise((resolve, reject) =>
    (async () => {
      try {
        const params = {
          Bucket: awsS3BucketName,
          Key: file
        }

        const command = new GetObjectCommand(params)

        const url = await getSignedUrl(client, command, {
          expiresIn: 36000
        })

        resolve(url)
      } catch (error) {
        reject(error)
      }
    })()
  )

module.exports = {
  client,
  GetObjectCommand,
  getDocumentUrl
}
