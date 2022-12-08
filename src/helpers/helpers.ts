export const popNotification = (
	setter: React.Dispatch<React.SetStateAction<string>>,
	msg: string
) => {
	setter(msg)
	setTimeout(() => {
		setter('')
	}, 6000)
}
