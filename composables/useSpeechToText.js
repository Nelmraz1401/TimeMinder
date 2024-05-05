export const useSpeechToText = () => {
  return useState('speechToText', () => {
    return {
      speech: null,
      last: '',
    }
  })
}
