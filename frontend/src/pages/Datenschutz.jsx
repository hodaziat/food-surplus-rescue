import React from 'react';

const Datenschutz = () => {
  return (
    <div className="container py-5" style={{ minHeight: '80vh' }}>
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
        <h2 className="fw-bold text-success mb-4">🔒 Datenschutzerklärung</h2>
        
        <p className="lead text-muted">
          Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Nachfolgend informieren wir Sie ausführlich über den Umgang mit Ihren Daten gemäß der Datenschutz-Grundverordnung (DSGVO) und dem Bundesdatenschutzgesetz (BDSG).
        </p>

        <hr className="my-4 opacity-25" />

        {/* 1. Responsible Entity */}
        <section className="mb-4">
          <h4 className="fw-bold text-dark">1. Verantwortliche Stelle</h4>
          <p className="text-muted">
            Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
          </p>

          <div className="bg-light p-3 rounded-3 border mb-3">
            <strong>Food Surplus Rescue Erlangen</strong><br />
            Berliner Ring 45<br />
            91052 Erlangen, Deutschland<br />
            Telefon: +49 9131 456789<br />
            E-Mail: kontakt@foodsurplus-erlangen.de
          </div>
        </section>

        {/* 2. Collection and Processing of Personal Data */}
        <section className="mb-4">
          <h4 className="fw-bold text-dark">2. Erfassung und Speicherung personenbezogener Daten</h4>
          
          <h6 className="fw-bold text-secondary mt-3">a) Beim Besuch der Website</h6>
          <p className="text-muted">
            Beim Aufrufen unserer Website werden durch den auf Ihrem Endgerät zum Einsatz kommenden Browser automatisch Informationen an den Server unserer Website gesendet. Diese Informationen werden temporär in einem sogenannten Logfile gespeichert:
          </p>
          <ul className="text-muted">
            <li>IP-Adresse des anfragenden Rechners</li>
            <li>Datum und Uhrzeit des Zugriffs</li>
            <li>Name und URL der abgerufenen Datei</li>
            <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
            <li>Verwendeter Browser und ggf. das Betriebssystem Ihres Rechners</li>
          </ul>

          <h6 className="fw-bold text-secondary mt-3">b) Bei Registrierung und Erstellung eines Nutzerkontos</h6>
          <p className="text-muted">
            Wenn Sie sich auf unserer Plattform als Kunde (Verbraucher) oder Spender (Restaurant/Bäckerei) registrieren, erheben wir folgende Pflichtangaben:
          </p>
          <ul className="text-muted">
            <li>Vor- und Nachname bzw. Firmenname</li>
            <li>Gültige E-Mail-Adresse</li>
            <li>Passwort (verschlüsselt gespeichert)</li>
            <li>Rolle im System (Kunde oder Spender)</li>
          </ul>
          <p className="text-muted">
            Die Verarbeitung dieser Daten erfolgt gemäß Art. 6 Abs. 1 lit. b DSGVO zur Erfüllung des Nutzungsvertrags.
          </p>

          <h6 className="fw-bold text-secondary mt-3">c) Bei Nutzung von Reservierungen und Bestellungen</h6>
          <p className="text-muted">
            Für die Durchführung von Lebensmittelreservierungen und Kaufabwicklungen verarbeiten wir die Daten zum ausgewählten Angebot, Bestellmengen, Zeitpunkte der Abholung sowie gewählte Zahlungsmethoden (z. B. Barzahlung, PayPal, Kreditkarte).
          </p>
        </section>

        {/* 3. Purpose of Data Processing */}
        <section className="mb-4">
          <h4 className="fw-bold text-dark">3. Zweck der Datenverarbeitung</h4>
          <p className="text-muted">
            Wir verarbeiten die genannten Daten zu folgenden Zwecken:
          </p>
          <ul className="text-muted">
            <li>Gewährleistung eines reibungslosen Verbindungsaufbaus der Website</li>
            <li>Bereitstellung und Verwaltung der Nutzerkonten</li>
            <li>Vermittlung von Lebensmittelangeboten zwischen Spendern und Rettern</li>
            <li>Abwicklung von Bestellungen, Zahlungen und Stornierungen</li>
            <li>Verhinderung von Missbrauch und Gewährleistung der Systemsicherheit</li>
          </ul>
        </section>

        {/* 4. Data Sharing */}
        <section className="mb-4">
          <h4 className="fw-bold text-dark">4. Weitergabe von Daten an Dritte</h4>
          <p className="text-muted">
            Eine Übermittlung Ihrer persönlichen Daten an Dritte zu anderen als den nachstehend aufgeführten Zwecken findet nicht statt. Wir geben Ihre persönlichen Daten nur an Dritte weiter, wenn:
          </p>
          <ul className="text-muted">
            <li>Sie Ihre ausdrückliche Einwilligung dazu erteilt haben (Art. 6 Abs. 1 lit. a DSGVO),</li>
            <li>dies für die Abwicklung von Vertragsverhältnissen erforderlich ist (Art. 6 Abs. 1 lit. b DSGVO), wie z.B. an den jeweiligen Lebensmittelspender zur Abholungsbestätigung,</li>
            <li>eine gesetzliche Verpflichtung besteht (Art. 6 Abs. 1 lit. c DSGVO).</li>
          </ul>
        </section>

        {/* 5. Cookies and LocalStorage */}
        <section className="mb-4">
          <h4 className="fw-bold text-dark">5. Cookies und technische Speicherung (LocalStorage)</h4>
          <p className="text-muted">
            Unsere Website nutzt die LocalStorage-Funktion Ihres Browsers sowie technisch notwendige Cookies, um Benutzersitzungen aufrechtzuerhalten, Anmeldedaten zu speichern und den Warenkorb zu verwalten. Dies dient der Bereitstellung eines funktionsfähigen Dienstes auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
          </p>
        </section>

        {/* 6. User Rights */}
        <section className="mb-4">
          <h4 className="fw-bold text-dark">6. Ihre Rechte als betroffene Person</h4>
          <p className="text-muted">
            Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:
          </p>
          <ul className="text-muted">
            <li><strong>Recht auf Auskunft (Art. 15 DSGVO):</strong> Sie können Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten verlangen.</li>
            <li><strong>Recht auf Berichtigung (Art. 16 DSGVO):</strong> Sie können die unverzügliche Berichtigung unrichtiger Daten verlangen.</li>
            <li><strong>Recht auf Löschung (Art. 17 DSGVO):</strong> Sie können die Löschung Ihrer bei uns gespeicherten personenbezogenen Daten verlangen.</li>
            <li><strong>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO):</strong> Sie haben das Recht, die Einschränkung der Verarbeitung zu verlangen.</li>
            <li><strong>Recht auf Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie können verlangen, Ihre Daten in einem strukturierten, gängigen Format zu erhalten.</li>
            <li><strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Sofern Ihre Daten auf Grundlage von berechtigten Interessen verarbeitet werden, haben Sie das Recht, Widerspruch einzulegen.</li>
          </ul>
        </section>

        {/* 7. Data Security */}
        <section className="mb-4">
          <h4 className="fw-bold text-dark">7. Datensicherheit</h4>
          <p className="text-muted">
            Wir verwenden innerhalb des Website-Besuchs das verbreitete SSL-Verfahren (Secure Socket Layer) in Verbindung mit der jeweils höchsten Verschlüsselungsstufe. Wir sichern unsere Website und sonstigen Systeme durch technische und organisatorische Maßnahmen gegen Verlust, Zerstörung, Zugriff, Veränderung oder Verbreitung Ihrer Daten durch unbefugte Personen.
          </p>
        </section>

        {/* 8. Updates to Privacy Policy */}
        <section className="mb-2">
          <h4 className="fw-bold text-dark">8. Aktualität und Änderung dieser Datenschutzerklärung</h4>
          <p className="text-muted mb-0">
            Diese Datenschutzerklärung ist aktuell gültig und hat den Stand <strong>Oktober 2026</strong>. Durch die Weiterentwicklung unserer Website oder aufgrund geänderter gesetzlicher beziehungsweise behördlicher Vorgaben kann es notwendig werden, diese Datenschutzerklärung zu ändern.
          </p>
        </section>

      </div>
    </div>
  );
};

export default Datenschutz;