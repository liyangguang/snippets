"""A simple server"""

import httplib
import json
import webapp2

import backend.email as email

class SendEmail(webapp2.RequestHandler):
  """Send email endpoint."""

  def get(self):
    url_param = int(self.request.path.split('/')[2])
    to = ['liyangguangcn@gmail.com']
    subject = 'Hello world'
    email_sender.send(to, subject, 'email.jinja2', {'name': url_param})
    self.response.write('Email sent')


app = webapp2.WSGIApplication(
    # These routes should match app.yaml
    [
        (r'\/my-cron-job\/.*', SendEmail),
    ],
    debug=True)