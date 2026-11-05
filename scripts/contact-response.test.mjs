import test from 'node:test';
import assert from 'node:assert/strict';
import { contactAcknowledgement } from '../src/lib/contact-response.ts';
test('requires explicit provider acknowledgement', () => {
  assert.equal(contactAcknowledgement(true, 200, {success:true}).accepted, true);
  for (const body of [{success:false}, {}, null, '<html>', {success:'true'}])
    assert.equal(contactAcknowledgement(true, 200, body).accepted, false);
});
test('HTTP failure cannot become successful through body', () => {
  assert.equal(contactAcknowledgement(false, 400, {success:true}).accepted, false);
  assert.equal(contactAcknowledgement(false, 503, null).message, 'Code 503');
});
test('remote message length is bounded', () => {
  assert.equal(contactAcknowledgement(false, 400, {message:'a'.repeat(200)}).message.length, 160);
});
