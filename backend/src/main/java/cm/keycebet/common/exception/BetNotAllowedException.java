package cm.keycebet.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BetNotAllowedException extends RuntimeException {

    public BetNotAllowedException(String message) {
        super(message);
    }
}
