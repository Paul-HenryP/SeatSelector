# SeatSelector
This repository contains a web application for flight planning and seat recommendation, developed for the CGI Summer Internship 2025. Users can search for flights using filters (destination, date, duration, price) and get seat recommendations based on their preferences (window seat, extra legroom, proximity to exit).

# Installation

## Zip file

1. Download the zip from this repository and extract it.
2. In Intellij click: new->From existing source, drag and drop the unzipped file or insert the path.

## Using Git
- [Intellij Docs](https://www.jetbrains.com/help/idea/opening-files-from-command-line.html)

1.  `Git clone `

2.  You can find the executable for running IntelliJ IDEA in the installation directory under bin. To use this executable as the command-line launcher, add it to your system PATH as described in Command-line interface.

4. open the project:

`idea64.exe C:\seatselector`

# Usage

Run the main java program (SeatSelectorApplication.java) by pressing the run button or using a shortcut key.

Open [localhost:8080](http://localhost:8080)

# Technologies Used

- Java 21
- Spring Boot
- HTML
- CSS
- JS

# Protsess (ET) / Process
Algul uuendasin nõutud tööriistu nagu Git ja Java, tutuvusin Spring Booti dokumentatsiooniga ja tegin katsetuseks ühe hello world projekti. (umbes 1.5h) Hakkasin juba mõtlema kuidas suures pildis võiks programm töötada. Kuna tegu on väikse projektiga siis valisin front endi jaoks välja vana hea HTML, CSS, JS kombo. 

Siis asusin töö kallale. Programm on esialgu jaotatud suuresti kolmeks paketiks: controller, model ja service. Lõin service paketis hardcoded andmete jaoks FlightService ja SeatService'i klassid, kus olid ka mõned meeetodid nende andmete käsitlemiseks. Lisaks veel model paketis lendude, istmete ja nende omaduste käsitlemiseks eraldi klassid Flight ja Seat. Controller paketis lõin FlightController ja SeatController klassid, mis tegelevad HTTP päringute töötlemisega ja andmete edastamisega front-end liidese ja teenusekihi vahel. FlightController vastutab lennuinfo kuvamise ja filtreerimise eest, pakkudes järgmisi API lõpp-punkte:

/api/flights - kõikide lendude saamiseks (GET meetod).
/api/flights/filter - lendude filtreerimiseks erinevate parameetrite põhjal (sihtkoht, kuupäev, väljalennu aeg, hind).
/api/flights/{id} - konkreetse lennu detailide saamiseks ID järgi.
SeatController käsitleb istmetega seotud päringuid ja pakub järgmisi API lõpp-punkte:
/api/seats/{flightId} - konkreetse lennu istmeplaani kuvamiseks.
/api/seats/{flightId}/recommend - istmete soovituste genereerimiseks kasutaja eelistuste põhjal.

SeatSelectorApplication on programmi peamine klass, mis käivitab Spring Boot rakenduse. (u. 5h)

Tegin esialgu katsetuseks mõned testid, uurisin JUnit testide loomise kohta youtube'ist.

## Eeldused:
- Eeldasin, et on okei kui lahendus on ingliskeelne.



