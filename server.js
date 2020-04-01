var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var cors = require('cors');
const creds = require('./config');

var transport = {
    host: creds.HOST,
    port: 587,
    auth: {
    user: creds.USER,
    pass: creds.PASSWORD
  }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

router.post('/contactus-service', (req, res, next) => {
  var name = req.body.name
  var email = req.body.email
  var message = req.body.message
  var content = `name: ${name} \n email: ${email} \n message: ${message} `
  console.log(content);
  var mail = {
    from: email,
    to: 'info@zoubi.ca',
    subject: 'Nouveau message du formulaire Contactez-nous',
    text: content
  }

  transporter.sendMail(mail, (err, data) => {
	if (err) {
  	res.json({
    	status: 'fail'
  	})
	} else {
  	res.json({
   	status: 'success'
  	})

  	transporter.sendMail({
    	from: "info@zoubi.ca",
    	to: email,
    	subject: "Votre message a bien été reçu",
    	text: `Merci de nous avoir contacté!\n\nDétails du formulaire\nNom: ${name}\n Courriel: ${email}\n Message: ${message}`
  	}, function(error, info){
    	if (error) {
      	console.log(error);
    	} else {
      	console.log('Message sent: ' + info.response);
    	}
  	});
	}
  })
})
const app = express()
app.use(cors())
app.use(express.json())
app.use('/', router)
app.listen(3002)