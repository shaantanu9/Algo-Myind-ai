
var partition = function(head, x) {
  const lessHead = new ListNode(0);
  const greaterHead = new ListNode(0);
  let less = lessHead;
  let greater = greaterHead;

  while (head) {
    if (head.val < x) {
      less.next = head;
      less = less.next;
    } else {
      greater.next = head;
      greater = greater.next;
    }
    head = head.next;
  }

  less.next = greaterHead.next;
  greater.next = null;

  return lessHead.next;
};
