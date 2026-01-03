using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Azure.Communication.Email;
using Azure;

namespace Company.Function;

public class ContactOgrodnik
{
    private readonly ILogger<ContactOgrodnik> _logger;

    public ContactOgrodnik(ILogger<ContactOgrodnik> logger)
    {
        _logger = logger;
    }

    [Function("ContactOgrodnik")]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequest req)
    {
        _logger.LogInformation("SendEmails Function Triggered.");
        string name = req.Query["name"];
        string email = req.Query["email"];
        string message = req.Query["message"];
        string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
        dynamic data = JsonConvert.DeserializeObject(requestBody);
        name = name ?? data?.name;
        email = email ?? data?.email;
        message = message ?? data?.message;
        var myEmailAddress = Environment.GetEnvironmentVariable("myEmailAddress");

        _logger.LogInformation("My email address: " + myEmailAddress);  
        var senderEmailAddress = Environment.GetEnvironmentVariable("senderEmailAddress");
        _logger.LogInformation("Sender email address: " + senderEmailAddress);
        var connectionString = Environment.GetEnvironmentVariable("AzureCommunicationServicesConnectionString");
        _logger.LogInformation("Connection string: " + connectionString);
        var emailClient = new EmailClient(connectionString);
        try
        {
            //Email to notify myself
            var selfEmailSendOperation = await emailClient.SendAsync(
                wait: WaitUntil.Completed,
                senderAddress: senderEmailAddress,
                recipientAddress: myEmailAddress,
                subject: $"New message in the website from {name} ({email})",
                htmlContent: "<html><body>" + name + " with email address " + email + " sent the following message: <br />" + message + "</body></html>");
            _logger.LogInformation($"Email sent with message ID: {selfEmailSendOperation.Id} and status: {selfEmailSendOperation.Value.Status}");
            //Email to notify the contact
            var contactEmailSendOperation = await emailClient.SendAsync(
                wait: WaitUntil.Completed,
                senderAddress: senderEmailAddress,
                recipientAddress: email,
                subject: $"Email sent. Thank you for reaching out.",
                htmlContent: "Hello " + name + " thank you for your message. Will try to get back you as soon as possible.");
            _logger.LogInformation($"Email sent with message ID: {contactEmailSendOperation.Id} and status: {contactEmailSendOperation.Value.Status}");
            return new OkObjectResult($"Emails sent.");
        }
        catch (Exception ex)
        {
            _logger.LogError($"Sending email operation failed with message: {ex.Message}");
            return new ConflictObjectResult("Error sending email");
        }
    }
}