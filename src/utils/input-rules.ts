export default class Rules {
	public static required(v: string) {
		v = v === undefined ? '' : v;

		return !!v || 'Required'
	}

	public static minUsername(v: string) {
		v = v === undefined ? '' : v;

		return v.length >= 5 || 'Min 5 characters'
	}

	public static maxUsername(v: string) {
		v = v === undefined ? '' : v;

		return v.length <= 10 || 'Max 10 characters'
	}

	public static validCharsUsername(v: string) {
		v = v === undefined ? '' : v;

		return /^[A-Za-z0-9]+$/.test(v) || 'Only letters and digits'
	}

	public static minPassword(v: string) {
		v = v === undefined ? '' : v;

		return v.length >= 6 || 'Min 6 characters'
	}

	public static maxPassword(v: string) {
		v = v === undefined ? '' : v;

		return v.length <= 20 || 'Max 20 characters'
	}

	public static validCharsPassword(v: string) {
		v = v === undefined ? '' : v;

		return /^[A-Za-z0-9_\-\s]+$/.test(v) || 'Only letters, digits, spaces, _ and -'
	}

	public static passwordIsStrong(v: string) {
		v = v === undefined ? '' : v;

		const hasUpper = /[A-Z]/.test(v);
		const hasLower = /[a-z]/.test(v);
		const hasDigit = /[0-9]/.test(v);


		return (hasUpper && hasLower && hasDigit) || 'Password needs a digit, an upper and a lower case letter'
	}

	public static passwordsMatch(pwd1: string, pwd2: string) {
		return function() {
			return (pwd1 == pwd2) || ('The paswords do not match')
		}
	}
}
