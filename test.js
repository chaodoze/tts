const textToSpeech = require('@google-cloud/text-to-speech');
const fetch = require('node-fetch')

async function doTTS(text) {
  console.log(`cred ${process.cwd()}, ${process.env.test}, ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`)
  const client = new textToSpeech.TextToSpeechClient()
  const request = {
    input: {text},
    voice: {languageCode: 'en-US', ssmlGender:'NEUTRAL'},
    audioConfig: {audioEncoding:'MP3'}
  }
  const [response] = await client.synthesizeSpeech(request)
  return response
}

module.exports = async (req, res) => {
  const {
    query: { raw }
  } = req

  const gist = await fetch(`https://gist.githubusercontent.com/twobitgo/${raw}`)
  const text = await gist.text()
  
  const mp3 = await doTTS(text)
  res.setHeader('content-type', 'audio/mpeg')
  res.send(mp3.audioContent)
}