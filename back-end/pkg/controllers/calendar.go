package controllers

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/angshumanHalder/potential-pancake/pkg/config"
	"github.com/angshumanHalder/potential-pancake/pkg/middlewares"
	"github.com/angshumanHalder/potential-pancake/pkg/services"
	"github.com/angshumanHalder/potential-pancake/pkg/utils"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/calendar/v3"
	"google.golang.org/api/option"
)

func Calendar(db *mongo.Database) http.HandlerFunc {
	var googleOauthConfig = &oauth2.Config{
		RedirectURL:  "http://localhost:3000",
		ClientID:     config.Config.Client.Id,
		ClientSecret: config.Config.Client.Secret,
		Scopes:       []string{},
		Endpoint:     google.Endpoint,
	}
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println("Calendar Handler")
		if r.Method != "POST" {
			return
		}
		var event services.CalendarEvent
		utils.FromJSON(r.Body, &event)
		// call google api
		user := r.Context().Value(middlewares.UserEmail).(services.User)
		googleCalendarEvent := &calendar.Event{
			Summary:     event.Name,
			Description: "Interview session",
			Start: &calendar.EventDateTime{
				DateTime: event.StartTime,
				TimeZone: event.Zone,
			},
			End: &calendar.EventDateTime{
				DateTime: event.EndTime,
				TimeZone: event.Zone,
			},
			Recurrence: []string{},
			Attendees: []*calendar.EventAttendee{
				{Email: event.Attendees[0]},
				{Email: event.Attendees[1]},
			},
		}
		var gT = oauth2.Token{
			AccessToken: user.AccessToken,
		}
		client := googleOauthConfig.Client(context.Background(), &gT)
		srv, err := calendar.NewService(context.Background(), option.WithHTTPClient(client))
		if err != nil {
			utils.ReturnErr(&w, fmt.Errorf("unable to retrieve client"), 500)
			return
		}
		calendarId := "primary"
		if _, err = srv.Events.Insert(calendarId, googleCalendarEvent).SendNotifications(true).Do(); err != nil {
			utils.ReturnErr(&w, fmt.Errorf("unable to create calendar event"), 500)
			return
		}
		if err = services.InsertEvent(db, event); err != nil {
			utils.ReturnErr(&w, fmt.Errorf("unable to create calendar event"), 500)
			return
		}
		utils.ReturnJSON(&w, func() (interface{}, error) {
			return event, nil
		})
	})
}
