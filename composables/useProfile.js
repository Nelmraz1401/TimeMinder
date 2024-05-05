export const useProfile = () => {
  return useState('profile', () => {
    return {
      just_checked_in: false,
      name: '',
      email: '',
      top_habit: '',
      level: '',
      task_done: ''
    }
  })
}
