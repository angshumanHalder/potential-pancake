package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/angshumanHalder/potential-pancake/pkg/config"
	"github.com/angshumanHalder/potential-pancake/pkg/services"
	"github.com/angshumanHalder/potential-pancake/pkg/utils"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type ErrorResponse struct {
	Message string
}

type LoginRequest struct {
	Code  string
	Scope []string
}

func Login(db *mongo.Database) http.Handler {
	log.Printf("inside login")
	var googleOauthConfig = &oauth2.Config{
		RedirectURL:  "http://localhost:3000",
		ClientID:     config.Config.Client.Id,
		ClientSecret: config.Config.Client.Secret,
		Scopes:       []string{},
		Endpoint:     google.Endpoint,
	}

	const oauthGoogleUrlAPI = "https://www.googleapis.com/oauth2/v2/userinfo?access_token="
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "POST" {
			return
		}
		body := LoginRequest{}
		utils.FromJSON(r.Body, &body)
		googleOauthConfig.Scopes = append(googleOauthConfig.Scopes, body.Scope...)
		token, err := googleOauthConfig.Exchange(context.Background(), body.Code)
		if err != nil {
			utils.ReturnErr(&w, fmt.Errorf("code exchange error %s", err), 400)
			return
		}
		userInfo, err := http.Get(oauthGoogleUrlAPI + token.AccessToken)
		if err != nil {
			utils.ReturnErr(&w, fmt.Errorf("fetch userinfo error %s", err), 404)
			return
		}
		defer userInfo.Body.Close()

		utils.ReturnJSON(&w, func() (interface{}, error) {
			body, err := io.ReadAll(userInfo.Body)
			if err != nil {
				return nil, err
			}
			var googleUser services.GoogleUser
			if err = json.Unmarshal(body, &googleUser); err != nil {
				log.Println("unmarshal", err)
				return nil, err
			}
			services.InsertUser(db, googleUser)
			return struct {
				Picture   string
				GivenName string
			}{
				Picture:   googleUser.Picture,
				GivenName: googleUser.GivenName,
			}, nil
		})
	})
}

func AuthorizeCalendar(db *mongo.Database) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {})
}
