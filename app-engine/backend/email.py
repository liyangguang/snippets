# Modified from //depot/google3/engedu/gmentors/email_sender/email_sender.py
"""Email sender."""

import email
import logging
import os
import re
import jinja2

from google.appengine.api import mail as appengine_mail

_FROM_EMAIL_ADDRESS = 'liyangguangcn@gmail.com'
_FROM_EMAIL_NAME = 'Yangguang Li'
_CC_EMAIL = 'liyangguangcn+cc@gmail.com'


class Template(object):
  """Just a scope to contain Jinja template resources and methods."""

  @classmethod
  def init(cls):
    cls._templates_dir = os.path.join(re.sub(r'/email\.pyc?', '', __file__), 'templates')
    cls.JINJA_ENVIRONMENT = jinja2.Environment(
        autoescape=True, loader=jinja2.FileSystemLoader(cls._templates_dir))

  @classmethod
  def evaluate_template(cls, template_name, parameters=None):
    """Apply parameters to Jinja template, returning an HTML string."""
    if parameters:
      for k, v in parameters.iteritems():
        if isinstance(v, str):
          parameters[k] = v.decode('utf-8')

    try:
      template = cls.JINJA_ENVIRONMENT.get_template(template_name)
      result = template.render(parameters or {})
      return result
    except jinja2.TemplateNotFound:
      complaint = 'No email template found for "%s"' % template_name
      logging.error(complaint)
      raise RuntimeError(complaint)
    return None


class _AppEngineMailer(object):
  """App Engine Mailer."""

  @classmethod
  def send(cls, to_emails, subject, html_content):
    """Send an email to users using App Engine's internal mail send queue."""
    message = email.mime.Multipart.MIMEMultipart()
    message['from'] = email.utils.formataddr(
        (_FROM_EMAIL_NAME, _FROM_EMAIL_ADDRESS))
    message['to'] = '; '.join(to_emails)
    message['cc'] = _CC_EMAIL

    # The subject gets cast to string when it's added to the headers, so we
    # need it in a form where str(subject) does not raise an exception
    try:
      str(subject)
    except UnicodeEncodeError:
      subject = subject.encode('utf-8')

    message['subject'] = subject
    message.attach(
        email.mime.Text.MIMEText(html_content, 'html', _charset='utf-8'))

    the_email = appengine_mail.EmailMessage()
    the_email.update_from_mime_message(message)
    try:
      the_email.send()
    except appengine_mail.Error as ex:
      _LOGGER.error('Failed sending email to %s: %s', to_emails, ex)


def send(to_emails, subject, template_name, template_params=None):
  """Send email to a set of users.

  Args:
    to_emails: An iterable of strings, each string containing one email address.
    subject: A string, the subject line of the email.
    template_name: Name of the Jinja template file(s)
    template_params: A dict of parameters used to populate the Jinja email
      content template(s).

  Raises:
    ValueError: On ill-formed email addresses.
    RuntimeError: On finding no templates matching template_name
  """

  to_emails = list(to_emails)
  if not all([appengine_mail.is_email_valid(e) for e in to_emails]):
    raise ValueError('At least one email address in %s is not valid.' %
                     to_emails)
  # pylint: disable=unbalanced-tuple-unpacking

  if template_params is None:
    template_params = {}

  html_content = Template.evaluate_template(template_name, template_params)
  _AppEngineMailer.send(to_emails, subject, html_content)
  logging.info('Sent mail:\nsubject "%s"\nto %s\ncontent:\n%s;', subject,
               str(to_emails), html_content)

Template.init()
