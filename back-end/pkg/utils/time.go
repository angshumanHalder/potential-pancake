package utils

import "time"

func StringToRFC3339(timestamp string) (int64, error) {
	t, err := time.Parse(time.RFC3339, timestamp)
	if err != nil {
		return 0, err
	}
	epoch := t.Unix()
	return epoch, err
}
