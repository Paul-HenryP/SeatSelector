# SeatSelector
This repository contains a web application for flight planning and seat recommendation, developed for the CGI Summer Internship 2025. Users can search for flights using filters and get seat recommendations based on their preferences.

# Installation

## Zip file

1. Download the zip from this repository and extract it.
2. In Intellij click: new->From existing source, drag and drop the unzipped file or insert the path.

## Using Git
- [Intellij Docs](https://www.jetbrains.com/help/idea/opening-files-from-command-line.html)

1.  `Git clone https://github.com/Paul-HenryP/SeatSelector.git`

2.  You can find the executable for running IntelliJ IDEA in the installation directory under bin. To use this executable as the command-line launcher, add it to your system PATH as described in [Command-line interface](https://www.jetbrains.com/help/idea/working-with-the-ide-features-from-command-line.html).

4. open the project:

  `idea64.exe C:\seatselector`

## Installing with Docker
Clone the repository:
   ```
   git clone https://github.com/Paul-HenryP/SeatSelector.git
   cd seatselector
   ```
## Or pull the Pre-Built Docker Image

```
docker pull paulhenryp/seatselector:latest
```

# Usage

Run the main java program (SeatSelectorApplication.java) by pressing the run button or using a shortcut key.

Open [localhost:8080](http://localhost:8080)

## Running with Docker

### Build & run the Docker Image

   ```
   docker build -t seatselector .
   docker run -p 8080:8080 seatselector
   ```
### Run the Pre-Built Docker Image

```
docker run -p 8080:8080 paulhenryp/seatselector
```

# Technologies Used

- Java 21
- Spring Boot
- HTML
- CSS
- JS

# Protsess (ET) / Process
Algul uuendasin nõutud tööriistu nagu Git ja Java, et tagada nende ajakohasus ja vältida võimalikke versiooniprobleeme. Tutuvusin Spring Booti dokumentatsiooniga ja tegin katsetuseks ühe hello world projekti. (~ 1.5h) Hakkasin juba mõtlema kuidas suures pildis võiks programm töötada. Kuna tegu on väikse projektiga siis valisin front endi jaoks välja vana hea HTML, CSS, JS kombo. 

Siis asusin töö kallale. Programm on esialgu jaotatud suuresti kolmeks paketiks: controller, model ja service. Lõin service paketis hardcoded andmete jaoks FlightService ja SeatService'i klassid, kus olid ka mõned meeetodid nende andmete käsitlemiseks. Hardcoded andmed lasin AI'l genereerida. Lisaks veel model paketis lendude, istmete ja nende omaduste käsitlemiseks eraldi klassid Flight ja Seat. Controller paketis lõin FlightController ja SeatController klassid, mis tegelevad HTTP päringute töötlemisega ja andmete edastamisega front-end liidese ja teenusekihi vahel. 

- FlightController vastutab lennuinfo kuvamise ja filtreerimise eest, ja sialdab järgmisi API lõpp-punkte:

`/api/flights` - kõikide lendude saamiseks (GET meetod).
`/api/flights/filter` - lendude filtreerimiseks erinevate parameetrite põhjal (sihtkoht, kuupäev, väljalennu aeg, hind).
`/api/flights/{id}` - konkreetse lennu detailide saamiseks ID järgi.

- SeatController käsitleb istmetega seotud päringuid ja pakub järgmisi API lõpp-punkte:
`/api/seats/{flightId}` - konkreetse lennu istmeplaani kuvamiseks.
`/api/seats/{flightId}/recommend` - istmete soovituste genereerimiseks kasutaja eelistuste põhjal.

SeatSelectorApplication on programmi peamine klass, mis käivitab Spring Boot rakenduse. (~ 5h)

Tegin esialgu katsetuseks mõned testid, uurisin JUnit testide loomise kohta youtube'ist.

Siis tegelesin rakenduse kuupäeva ja kellaaja vormindamise probleemide lahendamisega. Peamine probleem oli selles, et frontend kuvas kuupäevi ja kellaaegu vormingus, mis ei vastanud Euroopa standardile ning võis kasutajatele segadust tekitada. Kellaaja vormingu probleemi lahendamiseks otsustasin kasutada kellaaja sisendina tavateksti välja `<input type="text">` selle asemel, et kasutada `<input type="time">`, kuna JavaScript ei toeta kõikides brauserites 24-tunnise kellaaja vormingu sundimist. Lisasin loogika, mis parandab kellaaja sisendit automaatselt, kui kasutaja lõpetab aja sisestamise. AI aitas mul tuvastada ja lahendada keerulisi probleeme, mis võimaldas mul keskenduda rohkem arendustööle ja kvaliteedi tagamisele. Näiteks aitas tehisaru mul tuvastada JavaScripti kellaaja klassi tehnilisi piirangud ja pakkus välja lahendusi. (~ 3h)

Uurisin kuidas täpsemalt Gradle projektile Dockerfile faili luuakse. Katsetasin erinevaid viise, aga lõpuks kasutasin AI abi vigade lahendamiseks, mille abil sain Dockerfile korralikult vormistatud. (~ 1.5h)

## Eeldused:
- Eeldasin, et on okei kui lahendus ja kood on ingliskeelne.



