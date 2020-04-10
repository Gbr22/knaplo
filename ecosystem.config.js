module.exports = {
	apps:[{
		name:"knaplo",
		script:"npm",
		args:"run start-prod",
		env: {
			"PORT":3002,
		}
	}]
}
