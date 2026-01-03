using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Azure.Communication.Email;
using Azure;
using System.Threading.Tasks;

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
        string email = req.Query["email"];
        string message = req.Query["message"];
        string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
        dynamic data = JsonConvert.DeserializeObject(requestBody);
        email = email ?? data?.email;
        message = message ?? data?.message;
        var senderEmailAddress = Environment.GetEnvironmentVariable("senderEmailAddress");
        var myEmailAddress = Environment.GetEnvironmentVariable("myEmailAddress");
        var connectionString = Environment.GetEnvironmentVariable("AzureCommunicationServicesConnectionString");
        var emailClient = new EmailClient(connectionString);
        try
        {
            // Email to notify myself (admin)
            var selfEmailSendOperation = emailClient.SendAsync(
                    wait: WaitUntil.Started,
                    senderAddress: senderEmailAddress,
                    recipientAddress: myEmailAddress,
                    subject: $"Nowa wiadomość z formularza kontaktowego od {email}",
                    htmlContent:
                    $"""
                    <html>
                        <body style='font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 24px;'>
                            <div style='max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #eee; padding: 24px;'>
                                <h2 style='color: #2e7d32;'>Nowa wiadomość z formularza kontaktowego</h2>
                                <p><strong>Adres e-mail nadawcy:</strong> {email}</p>
                                <p><strong>Treść wiadomości:</strong></p>
                                <div style='background: #f1f8e9; border-radius: 4px; padding: 16px; margin-bottom: 16px;'>{message}</div>
                                <hr />
                                <p style='font-size: 12px; color: #888;'>Wiadomość wygenerowana automatycznie przez stronę ogrodnika.</p>
                            </div>
                        </body>
                    </html>
                    """
            );
            _logger.LogInformation($"Email sent with message ID: {selfEmailSendOperation.Id} and status: {selfEmailSendOperation.Value.Status}");

            // Email to notify the contact (user)
            var contactEmailSendOperation = emailClient.SendAsync(
                    wait: WaitUntil.Started,
                    senderAddress: senderEmailAddress,
                    recipientAddress: email,
                    subject: "Dziękujemy za kontakt z ogrodnikiem!",
                    htmlContent:
                    $"""
                    <html>
                        <body style='font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 24px;'>
                            <div style='max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #eee; padding: 24px;'>
                                <h2 style='color: #2e7d32;'>Dziękujemy za Twoją wiadomość!</h2>
                                <p>Otrzymaliśmy Twoją wiadomość i postaramy się odpowiedzieć jak najszybciej.</p>
                                <p style='margin-top: 24px;'>Pozdrawiamy,<br /><strong>Zespół Ogrodnika</strong></p>
                                <hr />
                                <p style='font-size: 12px; color: #888;'>Wiadomość wygenerowana automatycznie. Prosimy nie odpowiadać na ten e-mail.</p>
                            </div>
                        </body>
                    </html>
                    """
            );

            await Task.WhenAll(selfEmailSendOperation, contactEmailSendOperation);

            _logger.LogInformation($"Email sent with message ID: {contactEmailSendOperation.Id} and status: {contactEmailSendOperation.Value.Status}");
            return new OkObjectResult($"Wiadomości zostały wysłane.");
        }
        catch (Exception ex)
        {
                _logger.LogError($"Wysyłanie wiadomości e-mail nie powiodło się: {ex.Message}");
                return new ConflictObjectResult("Błąd podczas wysyłania wiadomości e-mail");
        }
    }
}